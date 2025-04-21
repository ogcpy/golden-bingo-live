import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const contactFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  facilityName: z.string().min(2, {
    message: "Facility name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(6, {
    message: "Please enter a valid phone number.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      facilityName: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    // In a real app, you would send the data to your backend or a service like FormSpree
    // This is a mock implementation that simulates the API call
    setTimeout(() => {
      console.log("Contact form data:", data);
      
      toast({
        title: "Message sent successfully!",
        description: "We'll respond to your inquiry as soon as possible.",
      });
      
      form.reset();
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Your Name</FormLabel>
              <FormControl>
                <Input placeholder="John Smith" {...field} className="text-lg p-3" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="facilityName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Facility Name</FormLabel>
              <FormControl>
                <Input placeholder="Golden Age Care Home" {...field} className="text-lg p-3" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" type="email" {...field} className="text-lg p-3" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="(555) 123-4567" type="tel" {...field} className="text-lg p-3" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Your Message</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell us how we can help you..." 
                  className="min-h-32 text-lg p-3"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-primary text-white hover:bg-primary/90 text-lg py-6"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
            </>
          ) : (
            "Send Message"
          )}
        </Button>
      </form>
    </Form>
  );
}
