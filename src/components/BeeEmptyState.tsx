import React from 'react';
import { Button } from '@/components/ui/button';

interface BeeEmptyStateProps {
  title?: string;
  message?: string;
  actionText?: string;
  onAction?: () => void;
}

export const BeeEmptyState: React.FC<BeeEmptyStateProps> = ({
  title = "No conversations yet!",
  message = "Start chatting with Mochi to learn about bees and gardening",
  actionText = "Start Conversation",
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-mobile-lg py-mobile-3xl">
      <div className="relative">
        <img 
          src="/lovable-uploads/220a09ac-6570-4d48-b70b-5ba2fc26e5cf.png" 
          alt="Mochi the Bee" 
          className="w-20 h-20 md:w-24 md:h-24 animate-bee-bounce filter drop-shadow-lg"
        />
        <div className="absolute -top-2 -right-2 text-2xl animate-bounce">💭</div>
      </div>
      
      <div className="space-y-mobile-sm max-w-md">
        <h3 className="text-responsive-lg font-semibold text-foreground">
          {title}
        </h3>
        <p className="text-responsive-sm text-muted-foreground">
          {message}
        </p>
      </div>
      
      {onAction && (
        <Button onClick={onAction} size="lg" className="mt-mobile-lg">
          {actionText}
        </Button>
      )}
    </div>
  );
};