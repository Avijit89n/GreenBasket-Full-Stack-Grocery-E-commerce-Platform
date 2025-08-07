import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock
} from "lucide-react";

export default function Contact() {
  return (
    <section className="bg-gray-50">
      <div className="w-full h-[400px]">
        <iframe
          title="Our Location"
          loading="lazy"
          allowFullScreen
          className="w-full h-full grayscale-[30%] contrast-125 rounded-b-xl"
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d11846.27792070346!2d88.38467361043215!3d22.75327250995237!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1751900378749!5m2!1sen!2sin"
        ></iframe>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-start">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-800">Need Help with Your Grocery Order?</h2>
          <p className="text-gray-600 text-base">
            Whether it's a delivery delay, refund issue, or product feedback — our support team is here for you.
            We respond quickly to ensure a smooth shopping experience.
          </p>

          <div className="mt-6 space-y-4 text-gray-700 text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="text-green-600 w-5 h-5 mt-1" />
              <p><strong>Store Location:</strong> 123 Main Street, Kolkata, WB</p>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="text-green-600 w-5 h-5 mt-1" />
              <p><strong>Quick Support:</strong> +91 98765 43210</p>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="text-green-600 w-5 h-5 mt-1" />
              <p><strong>Email:</strong> help@grocerydrop.in</p>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="text-green-600 w-5 h-5 mt-1" />
              <p><strong>Support Hours:</strong> 7:00 AM – 11:00 PM, All Days</p>
            </div>
          </div>

          <div className="mt-8 text-sm text-gray-600">
            <h4 className="font-semibold text-gray-800 mb-2">We help with:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Order tracking & delivery status</li>
              <li>Refunds and returns</li>
              <li>Missing or damaged items</li>
              <li>App login or technical issues</li>
              <li>Product suggestions & feedback</li>
            </ul>
          </div>
        </div>

        <div className="bg-white shadow-md border border-gray-200 rounded-xl p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Send Us a Message</h3>
          <form className="space-y-5 h-[380px]">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="you@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                required
                placeholder="How can we help you?"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition"
            >
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
