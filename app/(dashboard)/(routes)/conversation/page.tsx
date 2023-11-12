"use client";
import * as z from "zod";
import Heading from "@/components/Heading";
import { MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import { NextResponse } from "next/server";

import { checkApiLimit, incrementApiLimit } from "@/lib/api-limit";
import { METHODS } from "http";

const HUGGINGFACE_API_KEY = "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";
const API_URL =
  "https://api-inference.huggingface.co/models/microsoft/DialoGPT-large";

const ConversationPage = () => {
  const [prompt, setPrompt] = useState("");

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async () => {
    try {
      const requestData = {
        inputs: form.getValues("prompt"), 
      };

      const config = {
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post(API_URL, requestData, config);
      
      const { data } = response;
      setPrompt(data.generated_text);
    } catch (error) {
      console.log(error);
      new NextResponse("Internal error", { status: 500 });
    }
  };
  return (
    <div>
      <Heading
        title="Conversation"
        discription="Our most advanced conversational model"
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm gird gird-cols-12 gap-2"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:right-transparent"
                        disabled={isLoading}
                        placeholder="How to calculate the area of a circle?"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 lg:col-span-2 w-full"
                disabled={isLoading}
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
      </div>
      <div className="space-y-4 mt-4 ml-4">{prompt}</div>
    </div>
  );
};
export default ConversationPage;
