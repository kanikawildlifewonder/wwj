"use client";

import React, { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { sendContactSubmissionEmail } from "@/app/actions/emails";
import { getPageContent } from "@/app/actions/content";

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [contactEmail, setContactEmail] = useState("hello@wwj.com");

  useEffect(() => {
    getPageContent("store-settings").then((raw) => {
      if (raw) {
        try {
          const s = JSON.parse(raw);
          if (s.contactEmail) setContactEmail(s.contactEmail);
        } catch { /* keep default */ }
      }
    });
  }, []);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    const res = await sendContactSubmissionEmail(data);
    setIsSubmitting(false);
    if (res.success) {
      setIsSubmitted(true);
      toast.success("Message sent successfully!");
      reset();
    } else {
      toast.error(res.error || "Failed to send message.");
    }
  };

  return (
    <div className="bg-cream min-h-screen py-12 sm:py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-jungle mb-4">Contact Us</h1>
          <p className="text-jungle/60 text-lg max-w-2xl mx-auto">
            Have a question about a piece, an order, or our conservation efforts? We&apos;d love to hear from you.
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
                  <a href={`mailto:${contactEmail}`} className="text-jungle/60 hover:text-gold transition-colors">{contactEmail}</a>
                  <p className="text-sm text-jungle/40 mt-1">For general inquiries</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-ivory border border-jungle/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="font-display text-lg text-jungle">Phone</h3>
                  <a href="tel:+919849077246" className="text-jungle/60 hover:text-gold transition-colors">+91 98490 77246</a>
                  <p className="text-sm text-jungle/40 mt-1">Mon-Fri, 9am-6pm IST</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-ivory border border-jungle/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#25D366] fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-display text-lg text-jungle">WhatsApp</h3>
                  <a 
                    href="https://wa.me/919849077246?text=Hi!%20I%20have%20an%20inquiry%20regarding%20Wildlife%20Wonder%20Jewelry." 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-jungle/60 hover:text-gold transition-colors font-medium flex items-center gap-1.5"
                  >
                    Chat on WhatsApp
                  </a>
                  <p className="text-sm text-jungle/40 mt-1">Direct message support</p>
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
            <div className="bg-ivory rounded-xl border border-jungle/10 p-5 sm:p-8 shadow-sm">
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
                      <label className="block text-xs font-semibold text-jungle/60 uppercase tracking-wider mb-1">Name</label>
                      <input 
                        {...register("name", { required: "Name is required" })}
                        className="w-full premium-input px-4 py-3 rounded-btn bg-cream text-jungle text-sm focus:outline-none"
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-jungle/60 uppercase tracking-wider mb-1">Email</label>
                      <input 
                        type="email"
                        {...register("email", { 
                          required: "Email is required",
                          pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                        })}
                        className="w-full premium-input px-4 py-3 rounded-btn bg-cream text-jungle text-sm focus:outline-none"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-jungle/60 uppercase tracking-wider mb-1">Subject</label>
                    <select 
                      {...register("subject", { required: "Please select a subject" })}
                      className="w-full premium-input px-4 py-3 rounded-btn bg-cream text-jungle text-sm focus:outline-none cursor-pointer"
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
                    <label className="block text-xs font-semibold text-jungle/60 uppercase tracking-wider mb-1">Message</label>
                    <textarea 
                      {...register("message", { required: "Message is required" })}
                      rows={5}
                      className="w-full premium-input px-4 py-3 rounded-btn bg-cream text-jungle text-sm focus:outline-none resize-y"
                    ></textarea>
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-jungle hover-shimmer text-gold py-4 rounded-btn font-bold tracking-widest uppercase transition-all disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg hover:shadow-gold/5 active:scale-[0.99]"
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
