import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContactForm from "@/components/contact-form";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function Contact() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <section className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            We're here to help you get the most out of Golden Bingo Live for your care home.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-primary">Get In Touch</h2>
              <p className="text-lg mb-8">
                Have questions about Golden Bingo Live? Need help getting started? Our team is ready to assist you.
                Fill out the form and we'll get back to you as soon as possible.
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="w-6 h-6 text-primary mr-4 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold">Email Us</h3>
                    <p className="text-lg">info@goldenbingolive.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="w-6 h-6 text-primary mr-4 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold">Call Us</h3>
                    <p className="text-lg">(555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="w-6 h-6 text-primary mr-4 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold">Office Address</h3>
                    <p className="text-lg">123 Bingo Street<br />Golden City, GC 12345</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="w-6 h-6 text-primary mr-4 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold">Business Hours</h3>
                    <p className="text-lg">Monday - Friday: 9am - 5pm<br />Saturday & Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Card className="shadow-lg">
                <CardHeader className="bg-primary text-white">
                  <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <ContactForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-primary">Frequently Asked Questions</h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3 text-primary">How much does Golden Bingo Live cost?</h3>
              <p>We offer flexible pricing based on your care home's size and needs. Contact us for a personalized quote.</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3 text-primary">Can we try before we subscribe?</h3>
              <p>Yes! We offer a free trial session so you can experience Golden Bingo Live with your residents.</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3 text-primary">How many bingo cards should we order?</h3>
              <p>We recommend 1-2 cards per resident. You can always print more or order additional cards as needed.</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3 text-primary">What equipment do we need?</h3>
              <p>A TV or large tablet for displaying the game, internet connection, and a device with a camera for scanning winning cards.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
