import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { cn } from '@/lib/utils';

export default function TermsConditionPage() {
  return (
    <div className="flex min-h-screen min-w-20 flex-col">
      <Navbar />
      
      <div className="container mx-auto my-15 md:my-20 px-4 flex flex-col items-center">
        {/* Header */}
        <div className="max-w-[100vh]">
          <h1 className={cn(
            "mb-20 text-5xl md:text-7xl text-gray-900",
            "windsong-medium"
          )}>
            <span className="">Terms & Conditions</span>
          </h1>
        </div>

        {/* Content */}
        <div className="flex flex-col justify-between text-xs space-y-5 text-gray-600">
          <p>Welcome to JFK Tile and Stone Builders. By accessing and using our Web-Based Order Inquiry and Inventory 
            Management System, you agree to comply with and be bound by the following terms and conditions. 
            Please read these terms carefully before using our services.
          </p>
          <div>
            <h1 className="text-red-600 font-semibold text-sm mb-2">Acceptance of Terms </h1>
            <p>By submitting an order inquiry, creating an account, or using any feature of our System, you acknowledge that 
              you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with these 
              terms, please do not use our System.
            </p>
          </div>
          <div>
            <h1 className="text-red-600 font-semibold text-sm mb-2">Services Provided</h1>
            <p>JFK Tile and Stone Builders provides online order inquiry services for tiles, stones, kitchen and bath fixtures, 
                doors, and other construction materials. Our System allows customers to browse products, submit order inquiries, 
                track order status via Order ID and QR code, and receive automated email notifications regarding order updates.
            </p>
          </div>
          <div>
            <h1 className="text-red-600 font-semibold text-sm mb-2">Order Inquiries and Processing</h1>
            <p>All orders submitted through the System are inquiries subject to product availability, pricing verification, 
                and approval by JFK Tile and Stone Builders. We reserve the right to accept or decline any order at our 
                discretion. Prices displayed are subject to change without notice, and final pricing will be confirmed during 
                order review. Customers are responsible for all applicable taxes and fees. If a product is unavailable, 
                we will notify you and offer alternatives or cancellation.
            </p>
          </div>
          <div>
            <h1 className="text-red-600 font-semibold text-sm mb-2">Customer Responsibilities</h1>
            <p>Customers must provide accurate and complete information when submitting orders, including name, email, phone 
                number, and product specifications. Customers are responsible for keeping their Order ID and QR code secure 
                and confidential. Please check your email regularly for order updates and respond promptly to requests for 
                additional information.
            </p>
          </div>
          <div>
            <h1 className="text-red-600 font-semibold text-sm mb-2">Order Tracking and Notifications</h1>
            <p>Customers will receive automated email notifications at various stages of order processing sent to the email 
                address provided. We are not responsible for emails not received due to spam filters, incorrect addresses, 
                or technical issues. You can track your order status using your Order ID or QR code on our website.
            </p>
          </div>
          <div>
            <h1 className="text-red-600 font-semibold text-sm mb-2">Cancellations and Modifications</h1>
            <p>Cancellation requests must be made before the order enters the Processing stage by contacting us via email or 
                phone. Orders already processed may not be eligible for cancellation. Modification requests should be 
                submitted as soon as possible, though we cannot guarantee changes once processing has begun.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}