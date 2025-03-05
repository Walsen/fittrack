"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { BotIcon } from "lucide-react";

export default function ChatPage() {
  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">
        Chat with Your Fitness Assistant
      </h1>

      <Card className="shadow-md border-0">
        <CardHeader className="border-b bg-muted/50">
          <CardTitle className="text-lg flex items-center">
            <BotIcon className="h-5 w-5 mr-2 text-primary" />
            Workout Assistant
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
