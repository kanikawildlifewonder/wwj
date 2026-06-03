"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    // Simulate network request
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success("Message sent successfully!");
    reset();
  };

  return (
    <div className="bg-cream min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl text-jungle mb-4">Contact Us</h1>
          <p className="text-jungle/60 text-lg max-w-2xl mx-auto">
            Have a question about a piece, an order, or our conservation efforts? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20">
          {/* Contact Info */}
          <div className="md:col-span-5 space-y-10">
            <div>
              <h2 className="font-display text-2xl text-jungle mb-6">Get in Touch</h2>
              <p className="text-jungle/70 leading-relaxed mb-8">
                Our customer care team is available Monday through Friday, 9am to 6pm IST. We aim to respond to all inquiries within 24 hours.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-ivory border border-jungle/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="font-display text-lg text-jungle">Email</h3>
                  <a href="mailto:hello@wwj.com" className="text-jungle/60 hover:text-gold transition-colors">hello@wwj.com</a>
                  <p className="text-sm text-jungle/40 mt-1">For general inquiries</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-ivory border border-jungle/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="font-display text-lg text-jungle">Phone</h3>
                  <a href="tel:+919876543210" className="text-jungle/60 hover:text-gold transition-colors">+91 98765 43210</a>
                  <p className="text-sm text-jungle/40 mt-1">Mon-Fri, 9am-6pm IST</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-ivory border border-jungle/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="font-display text-lg text-jungle">Studio</h3>
                  <p className="text-jungle/60">
                    123 Artisan Lane,<br />
                    Bandra West, Mumbai<br />
                    Maharashtra 400050, India
                  </p>
                  <p className="text-sm text-jungle/40 mt-1">By appointment only</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-7">
            <div className="bg-ivory rounded-xl border border-jungle/10 p-8 shadow-sm">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="font-display text-2xl text-jungle mb-2">Message Sent!</h3>
                  <p className="text-jungle/60 mb-8">
                    Thank you for reaching out to WWJ. Our team will get back to you shortly.
                  </p>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="border border-jungle text-jungle px-6 py-2 rounded-btn font-bold tracking-widest uppercase hover:bg-jungle/5 transition-colors text-sm"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <h3 className="font-display text-xl text-jungle mb-6">Send us a Message</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-jungle/70 mb-1">Name</label>
                      <input 
                        {...register("name", { required: "Name is required" })}
                        className="w-full border border-border px-4 py-3 rounded-btn bg-cream focus:outline-none focus:border-gold"
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm text-jungle/70 mb-1">Email</label>
                      <input 
                        type="email"
                        {...register("email", { 
                          required: "Email is required",
                          pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                        })}
                        className="w-full border border-border px-4 py-3 rounded-btn bg-cream focus:outline-none focus:border-gold"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-jungle/70 mb-1">Subject</label>
                    <select 
                      {...register("subject", { required: "Please select a subject" })}
                      className="w-full border border-border px-4 py-3 rounded-btn bg-cream focus:outline-none focus:border-gold"
                    >
                      <option value="">Select a topic...</option>
                      <option value="order">Order Inquiry</option>
                      <option value="product">Product Information</option>
                      <option value="press">Press & Media</option>
                      <option value="conservation">Conservation Partnerships</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm text-jungle/70 mb-1">Message</label>
                    <textarea 
                      {...register("message", { required: "Message is required" })}
                      rows={5}
                      className="w-full border border-border px-4 py-3 rounded-btn bg-cream focus:outline-none focus:border-gold resize-y"
                    ></textarea>
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-jungle text-gold py-4 rounded-btn font-bold tracking-widest uppercase hover:bg-charcoal transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                    {!isSubmitting && <Send className="w-4 h-4" />}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
