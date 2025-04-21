export default function HowToPlaySteps() {
  const steps = [
    {
      number: 1,
      title: "Print or Order Cards",
      description: "Generate unique bingo cards from our website or order pre-printed cards for your care home.",
      imageSrc: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      number: 2,
      title: "Join the Live Game",
      description: "Tune in to our live bingo session on TV or tablet at the scheduled time. Numbers will be called clearly.",
      imageSrc: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      number: 3,
      title: "Verify Winning Card",
      description: "When someone wins, scan the QR code on their card to verify the win within 30 minutes.",
      imageSrc: "https://images.unsplash.com/photo-1580130281320-0ef0f0c60442?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
  ];

  return (
    <section className="py-8 md:py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-primary">How To Play</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-primary text-white w-16 h-16 flex items-center justify-center text-3xl font-bold">
                  {step.number}
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center">{step.title}</h3>
              <p className="text-xl">{step.description}</p>
              
              <div className="mt-4 rounded-lg w-full h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
