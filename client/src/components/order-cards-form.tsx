import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardHeader,
  CardTitle,
  CardFooter 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function OrderCardsForm() {
  const [cardPacks, setCardPacks] = useState("1");
  const [cardType, setCardType] = useState("standard");
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [orderFormData, setOrderFormData] = useState({
    facilityName: "",
    contactName: "",
    email: "",
    phone: "",
    address: "",
  });
  const { toast } = useToast();

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await apiRequest("POST", "/api/card-orders", orderData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Order placed successfully!",
        description: "Your card order has been received. We'll process it shortly.",
      });
      setIsOrderFormOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error placing order",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleOpenOrderForm = () => {
    setIsOrderFormOpen(true);
  };

  const handleOrderFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrderFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = () => {
    // Basic validation
    if (!orderFormData.facilityName || !orderFormData.email || !orderFormData.address) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const packSizes = {
      "1": 25,
      "2": 50,
      "4": 100,
    };
    
    const quantity = packSizes[cardPacks as keyof typeof packSizes] || 25;
    
    createOrderMutation.mutate({
      userId: 1, // In a real app, get from auth
      quantity,
      cardType,
      shippingAddress: `${orderFormData.facilityName}\n${orderFormData.contactName}\n${orderFormData.address}\n${orderFormData.phone}\n${orderFormData.email}`,
    });
  };

  return (
    <>
      <Card className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-primary h-full">
        <CardHeader className="bg-primary text-white p-4">
          <CardTitle className="text-2xl md:text-3xl font-bold text-center">Order Cards</CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 flex flex-col items-center">
          <div className="w-full h-48 bg-gray-200 rounded mb-4 flex items-center justify-center overflow-hidden">
            <div className="flex space-x-2 items-center justify-center">
              <div className="bg-white border-2 border-primary p-2 rounded w-32 h-40">
                <div className="grid grid-cols-5 gap-1">
                  <div className="bg-primary text-white text-center p-1 text-xs font-bold">B</div>
                  <div className="bg-primary text-white text-center p-1 text-xs font-bold">I</div>
                  <div className="bg-primary text-white text-center p-1 text-xs font-bold">N</div>
                  <div className="bg-primary text-white text-center p-1 text-xs font-bold">G</div>
                  <div className="bg-primary text-white text-center p-1 text-xs font-bold">O</div>
                </div>
                <div className="flex justify-center items-center h-28">
                  <div className="text-center">
                    <div className="text-lg font-bold">BINGO</div>
                    <div className="text-xs">Professional Cards</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-1">
                <div className="text-black text-sm font-bold">✓ Pre-printed</div>
                <div className="text-black text-sm font-bold">✓ Professional quality</div>
                <div className="text-black text-sm font-bold">✓ Delivered to you</div>
                <div className="text-black text-sm font-bold">✓ Ready to play</div>
              </div>
            </div>
          </div>
          
          <p className="text-lg md:text-xl text-center mb-6">Order professional printed cards delivered to your facility.</p>
          
          <div className="space-y-4 w-full">
            <div className="flex items-center">
              <Label className="block text-xl w-40">Card packs:</Label>
              <Select value={cardPacks} onValueChange={setCardPacks}>
                <SelectTrigger className="p-3 border border-gray-300 rounded text-xl w-24">
                  <SelectValue placeholder="1 pack" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 (25 cards)</SelectItem>
                  <SelectItem value="2">2 (50 cards)</SelectItem>
                  <SelectItem value="4">4 (100 cards)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center">
              <Label className="block text-xl w-40">Card type:</Label>
              <Select value={cardType} onValueChange={setCardType}>
                <SelectTrigger className="p-3 border border-gray-300 rounded text-xl w-24">
                  <SelectValue placeholder="Standard" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="laminated">Laminated</SelectItem>
                  <SelectItem value="large_print">Large Print</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-6 pt-0">
          <Button 
            onClick={handleOpenOrderForm}
            className="mt-6 bg-[#f6ad55] hover:bg-[#fbd38d] text-primary font-bold text-xl py-4 px-8 rounded-lg w-full transition duration-300"
          >
            <ShoppingCart className="mr-2" /> Order Physical Cards
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isOrderFormOpen} onOpenChange={setIsOrderFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Order Physical Cards</DialogTitle>
            <DialogDescription>
              Fill in your details to place an order for {cardPacks === "1" ? "25" : cardPacks === "2" ? "50" : "100"} {cardType} bingo cards.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="facilityName">Facility Name *</Label>
              <Input
                id="facilityName"
                name="facilityName"
                value={orderFormData.facilityName}
                onChange={handleOrderFormChange}
                placeholder="Golden Age Care Home"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="contactName">Contact Person *</Label>
              <Input
                id="contactName"
                name="contactName"
                value={orderFormData.contactName}
                onChange={handleOrderFormChange}
                placeholder="John Smith"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={orderFormData.email}
                onChange={handleOrderFormChange}
                placeholder="info@example.com"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                value={orderFormData.phone}
                onChange={handleOrderFormChange}
                placeholder="(555) 123-4567"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="address">Shipping Address *</Label>
              <Textarea
                id="address"
                name="address"
                value={orderFormData.address}
                onChange={handleOrderFormChange}
                placeholder="123 Main St, Anytown, USA 12345"
                required
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOrderFormOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitOrder}
              disabled={createOrderMutation.isPending}
              className="bg-primary text-white"
            >
              {createOrderMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Submit Order"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
