import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { GameSession, BingoCard } from '@/lib/types';
import { formatDate } from '@/lib/utils';

import CardPreview from '@/components/CardPreview';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const OrderCards: React.FC = () => {
  const [selectedGameSession, setSelectedGameSession] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(20);
  const [generatedCards, setGeneratedCards] = useState<BingoCard[]>([]);
  const [formData, setFormData] = useState({
    careHomeName: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    postcode: ''
  });
  const { toast } = useToast();
  
  // Fetch game sessions
  const { data: gameSessions, isLoading: isLoadingGames } = useQuery<GameSession[]>({
    queryKey: ['/api/game-sessions'],
  });
  
  // Generate cards mutation
  const generateCardsMutation = useMutation({
    mutationFn: async () => {
      if (!selectedGameSession) {
        throw new Error("Please select a game session");
      }
      
      const response = await apiRequest(
        'POST',
        '/api/bingo-cards/generate',
        { gameSessionId: selectedGameSession, quantity }
      );
      
      return response.json();
    },
    onSuccess: (data: BingoCard[]) => {
      setGeneratedCards(data);
      toast({
        title: "Cards Generated",
        description: `${data.length} bingo cards have been generated for your order.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Mark cards as ordered mutation
  const orderCardsMutation = useMutation({
    mutationFn: async () => {
      if (generatedCards.length === 0) {
        throw new Error("No cards to order");
      }
      
      const cardIds = generatedCards.map(card => card.id);
      const response = await apiRequest(
        'POST',
        '/api/bingo-cards/order',
        { cardIds }
      );
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Order Placed Successfully",
        description: `Your order for ${generatedCards.length} cards has been placed. You will receive a confirmation email shortly.`,
      });
      
      // Reset form
      setGeneratedCards([]);
      setFormData({
        careHomeName: '',
        contactName: '',
        email: '',
        phone: '',
        address: '',
        postcode: ''
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Order Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handle quantity change
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= 100) {
      setQuantity(value);
    }
  };
  
  // Handle game session change
  const handleGameSessionChange = (value: string) => {
    setSelectedGameSession(parseInt(value));
  };
  
  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle generate cards
  const handleGenerateCards = () => {
    if (!selectedGameSession) {
      toast({
        title: "Error",
        description: "Please select a game session",
        variant: "destructive",
      });
      return;
    }
    
    generateCardsMutation.mutate();
  };
  
  // Handle place order
  const handlePlaceOrder = () => {
    // Validate form
    if (!formData.careHomeName || !formData.contactName || !formData.email || !formData.phone || !formData.address || !formData.postcode) {
      toast({
        title: "Missing Information",
        description: "Please fill in all the required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Place order
    orderCardsMutation.mutate();
  };
  
  // Calculate order total
  const calculateTotal = () => {
    const pricePerCard = 0.50;
    const shippingCost = 5.99;
    
    const cardsTotal = quantity * pricePerCard;
    const total = cardsTotal + shippingCost;
    
    return {
      cardsTotal: cardsTotal.toFixed(2),
      shipping: shippingCost.toFixed(2),
      total: total.toFixed(2)
    };
  };
  
  const { cardsTotal, shipping, total } = calculateTotal();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">Order Bingo Cards</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">Select Game & Quantity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label htmlFor="game-session" className="text-lg mb-2 block">Game Session</Label>
                  <Select 
                    onValueChange={handleGameSessionChange}
                    disabled={isLoadingGames || generateCardsMutation.isPending}
                  >
                    <SelectTrigger id="game-session" className="w-full text-lg p-5">
                      <SelectValue placeholder="Select a game" />
                    </SelectTrigger>
                    <SelectContent>
                      {gameSessions?.map((session) => (
                        <SelectItem key={session.id} value={session.id.toString()} className="text-lg">
                          {formatDate(session.scheduledDate)} - {session.gameTimeGmt} GMT
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="quantity" className="text-lg mb-2 block">Cards Quantity (1-100)</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max="100"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-full text-lg p-5"
                    disabled={generateCardsMutation.isPending}
                  />
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  onClick={handleGenerateCards}
                  disabled={generateCardsMutation.isPending || !selectedGameSession}
                  className="bg-primary hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-lg text-xl"
                >
                  {generateCardsMutation.isPending ? 'Generating Cards...' : 'Generate Preview'}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {generatedCards.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-2xl">Delivery Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <Label htmlFor="careHomeName" className="text-lg mb-2 block">Care Home Name</Label>
                    <Input
                      id="careHomeName"
                      name="careHomeName"
                      value={formData.careHomeName}
                      onChange={handleInputChange}
                      className="w-full text-lg p-5"
                      disabled={orderCardsMutation.isPending}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contactName" className="text-lg mb-2 block">Contact Name</Label>
                    <Input
                      id="contactName"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleInputChange}
                      className="w-full text-lg p-5"
                      disabled={orderCardsMutation.isPending}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-lg mb-2 block">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full text-lg p-5"
                      disabled={orderCardsMutation.isPending}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="text-lg mb-2 block">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full text-lg p-5"
                      disabled={orderCardsMutation.isPending}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="address" className="text-lg mb-2 block">Delivery Address</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full text-lg p-5 min-h-[100px]"
                      disabled={orderCardsMutation.isPending}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="postcode" className="text-lg mb-2 block">Postcode</Label>
                    <Input
                      id="postcode"
                      name="postcode"
                      value={formData.postcode}
                      onChange={handleInputChange}
                      className="w-full text-lg p-5"
                      disabled={orderCardsMutation.isPending}
                    />
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <Button 
                    onClick={handlePlaceOrder}
                    disabled={orderCardsMutation.isPending}
                    className="bg-secondary hover:bg-yellow-500 text-primary font-bold py-3 px-8 rounded-lg text-xl"
                  >
                    {orderCardsMutation.isPending ? 'Processing Order...' : 'Place Order'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-2xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-lg">
                  <span>Cards ({quantity})</span>
                  <span>£{cardsTotal}</span>
                </div>
                <div className="flex justify-between items-center text-lg">
                  <span>Shipping</span>
                  <span>£{shipping}</span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold pt-4 border-t">
                  <span>Total</span>
                  <span>£{total}</span>
                </div>
              </div>
              
              {generatedCards.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-4">Card Preview</h3>
                  <CardPreview card={generatedCards[0]} gridOnly={true} showCardId={false} showQrCode={false} />
                </div>
              )}
              
              <div className="mt-8 bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-2">Order Information</h3>
                <ul className="text-sm space-y-2">
                  <li>Cards will be printed on high-quality cardstock</li>
                  <li>Each card has a unique identifier and QR code</li>
                  <li>Delivery within 3-5 business days</li>
                  <li>Free lamination for durability</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default OrderCards;
