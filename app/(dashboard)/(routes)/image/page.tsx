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

const HUGGINGFACE_API_KEY = "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";
const API_URL =
  "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1";

const ConversationPage = () => {
  const [img, setImg] = useState<string>();

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
      const config = {
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: form.getValues("prompt"),
        })
      };

      const response = await fetch(API_URL, config);
      const blob = await response.blob()
      setImg(URL.createObjectURL(blob));

    } catch (error) {
      console.log(error);
      new NextResponse("Internal error", { status: 500 })
    }
  };
  return (
    <div>
      <Heading
        title="Image"
        discription="Our most advanced Image model"
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
      <div>
      <img src={img} alt="genimage" />
    </div>
    </div>
  );
};
export default ConversationPage;
