import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

interface CallToActionProps {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonLink?: string;
}

const CallToAction: React.FC<CallToActionProps> = ({
  title = "Ready to bring Golden Bingo Live to your care home?",
  description = "Join hundreds of care homes across the country providing engaging activities for residents",
  primaryButtonText = "Register Your Care Home",
  secondaryButtonText = "Book a Demo",
  primaryButtonLink = "/register",
  secondaryButtonLink = "/contact"
}) => {
  return (
    <section className="bg-primary text-white rounded-lg shadow-xl p-8 mb-12 text-center">
      <h2 className="text-3xl font-bold mb-4">{title}</h2>
      <p className="text-xl mb-6">{description}</p>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
        <Link href={primaryButtonLink}>
          <Button className="bg-secondary text-primary hover:bg-yellow-400 font-bold py-3 px-8 rounded-lg text-xl transition-colors">
            {primaryButtonText}
          </Button>
        </Link>
        <Link href={secondaryButtonLink}>
          <Button className="bg-white text-primary hover:bg-gray-100 font-bold py-3 px-8 rounded-lg text-xl transition-colors">
            {secondaryButtonText}
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CallToAction;
