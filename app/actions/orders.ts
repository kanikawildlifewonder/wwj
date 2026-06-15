'use server';
 
import prisma from "@/lib/prisma";
import Razorpay from "razorpay";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guard";

interface OrderDataInput {
  clerkUserId?: string | null;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
}

interface OrderItemInput {
  productId: string;
  quantity: number;
  price: number;
}

/**
 * Creates a Razorpay Order on the server side
 * Razorpay expects amount in paise (1 INR = 100 Paise)
 */
export async function createRazorpayOrder(amount: number) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      throw new Error("Razorpay credentials are not configured on the server.");
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: Math.round(amount * 100), // convert to paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return {
      success: true,
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    };
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create payment order",
    };
  }
}

/**
 * Saves a completed and paid order to the database
 */
export async function createOrder(orderData: OrderDataInput, items: OrderItemInput[]) {
  try {
    const order = await prisma.order.create({
      data: {
        clerkUserId: orderData.clerkUserId || null,
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        totalAmount: orderData.totalAmount,
        status: "Processing",
        razorpayPaymentId: orderData.razorpayPaymentId,
        razorpayOrderId: orderData.razorpayOrderId,
        razorpaySignature: orderData.razorpaySignature,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
      },
    });

    revalidatePath("/admin/orders");
    return { success: true, order };
  } catch (error) {
    console.error("Error creating database order:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save order to database",
    };
  }
}

/**
 * Retrieves all orders from the database for the admin dashboard
 */
export async function getOrders() {
  try {
    await requireAdmin();
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return { success: true, orders };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch orders from database",
      orders: [],
    };
  }
}

/**
 * Aggregates real database stats for the admin overview dashboard
 */
export async function getDashboardStats() {
  try {
    await requireAdmin();
    const orders = await prisma.order.findMany({
      select: {
        totalAmount: true,
        createdAt: true,
        customerEmail: true,
      }
    });

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalOrdersCount = orders.length;
    const uniqueEmails = new Set(orders.map(o => o.customerEmail.toLowerCase().trim()));
    const activeCustomersCount = uniqueEmails.size;

    const lowStockCount = await prisma.product.count({
      where: {
        inStock: false
      }
    });

    const recentDbOrders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    // 7-day revenue grouping
    const last7DaysData: { name: string; total: number; dateStr: string }[] = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const name = days[d.getDay()];
      last7DaysData.push({ name, total: 0, dateStr: d.toDateString() });
    }

    orders.forEach(order => {
      const orderDateStr = new Date(order.createdAt).toDateString();
      const match = last7DaysData.find(item => item.dateStr === orderDateStr);
      if (match) {
        match.total += order.totalAmount;
      }
    });

    const chartData = last7DaysData.map(item => ({
      name: item.name,
      total: item.total
    }));

    return {
      success: true,
      stats: {
        totalRevenue,
        totalOrders: totalOrdersCount,
        activeCustomers: activeCustomersCount,
        lowStock: lowStockCount,
        recentOrders: recentDbOrders.map(o => ({
          id: o.id,
          customerName: o.customerName,
          totalAmount: o.totalAmount,
          status: o.status,
          createdAt: o.createdAt.toISOString()
        })),
        chartData
      }
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to load dashboard metrics",
      stats: null
    };
  }
}

/**
 * Aggregates real customers list based on completed checkout orders
 */
export async function getAdminCustomers() {
  try {
    await requireAdmin();
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        customerName: true,
        customerEmail: true,
        totalAmount: true,
        createdAt: true,
      }
    });

    const customerMap = new Map<string, {
      name: string;
      email: string;
      ordersCount: number;
      totalSpent: number;
      joined: string;
      status: string;
    }>();

    orders.forEach(order => {
      const email = order.customerEmail.toLowerCase().trim();
      const existing = customerMap.get(email);

      if (existing) {
        existing.ordersCount += 1;
        existing.totalSpent += order.totalAmount;
        const orderDate = order.createdAt.toISOString();
        if (orderDate < existing.joined) {
          existing.joined = orderDate;
        }
      } else {
        customerMap.set(email, {
          name: order.customerName,
          email: order.customerEmail,
          ordersCount: 1,
          totalSpent: order.totalAmount,
          joined: order.createdAt.toISOString(),
          status: "Active"
        });
      }
    });

    const customersList = Array.from(customerMap.values());

    customersList.forEach(c => {
      const joinDate = new Date(c.joined);
      const diffTime = Math.abs(Date.now() - joinDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (c.ordersCount >= 5) {
        c.status = "Active";
      } else if (diffDays <= 7) {
        c.status = "New";
      } else {
        c.status = "Active";
      }
    });

    return { success: true, customers: customersList };
  } catch (error) {
    console.error("Error fetching admin customers:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to load customers from database",
      customers: []
    };
  }
}

/**
 * Updates an order status in the database
 */
export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await requireAdmin();
    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: status,
      },
    });

    revalidatePath("/admin/orders");
    return { success: true, order: updatedOrder };
  } catch (error) {
    console.error("Error updating order status:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update order status",
    };
  }
}


