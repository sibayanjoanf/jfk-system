import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { cn } from '@/lib/utils';

export default function PrivacyPolicyPage() {
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
            <span className="">Privacy Policy</span>
          </h1>
        </div>

        {/* Content */}
        <div className="flex flex-col justify-between text-xs space-y-5 text-gray-600">
          <p>JFK Tile and Stone Builders is committed to protecting the privacy and security of your personal information. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Web-Based 
            Order Inquiry and Inventory Management System.
          </p>
          <div>
            <h1 className="text-red-600 font-semibold text-sm mb-2">Information We Collect</h1>
            <p>We collect personal information that you voluntarily provide when using our System, including your name, 
              email address, phone number, delivery or pickup address, and order details such as product specifications 
              and quantities. We also automatically collect certain technical information when you access our System, 
              including your IP address, browser type, device information, operating system, and usage data such as pages 
              viewed and time spent on the System. Additionally, we collect order-related information including order history, 
              order status updates, payment information (if applicable), and communication records between you and our team.
            </p>
          </div>
          <div>
            <h1 className="text-red-600 font-semibold text-sm mb-2">How We Use Your Information</h1>
            <p>We use the information we collect to process and fulfill your order inquiries, verify product availability and 
              pricing, and communicate order status updates through automated email notifications. Your information helps us 
              provide customer support, respond to your inquiries and requests, and improve our System functionality and user 
              experience. We also use collected data to maintain System security, prevent fraud and unauthorized access, 
              analyze usage patterns to enhance our services, and comply with legal obligations and regulatory requirements. 
              With your consent, we may send promotional materials and marketing communications about our products and services.
            </p>
          </div>
          <div>
            <h1 className="text-red-600 font-semibold text-sm mb-2">How We Share Your Information</h1>
            <p>We do not sell, trade, or rent your personal information to third parties. However, we may share your information 
              with trusted service providers who assist us in operating our System, conducting our business, or servicing you, 
              provided they agree to keep this information confidential. We may disclose your information when required by law, 
              in response to legal processes, to protect our rights and property, to prevent fraud or security threats, and 
              during business transfers such as mergers, acquisitions, or asset sales. Your information may also be shared 
              with delivery or logistics providers solely for order fulfillment purposes.
            </p>
          </div>
          <div>
            <h1 className="text-red-600 font-semibold text-sm mb-2">Data Security</h1>
            <p>We implement reasonable technical, administrative, and physical security measures to protect your personal 
              information from unauthorized access, disclosure, alteration, and destruction. These measures include secure 
              data encryption during transmission, restricted access to personal information by authorized personnel only,
              regular security assessments and system updates, and secure server infrastructure with firewalls and intrusion 
              detection. However, please be aware that no method of transmission over the internet or electronic storage is 
              completely secure. While we strive to use commercially acceptable means to protect your personal information, 
              we cannot guarantee its absolute security.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}