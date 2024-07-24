"use client"
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { messageSchema } from '@/schemas/messageSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import axios, { AxiosError } from 'axios';
import { toast } from '@/components/ui/use-toast';
import { ApiResponse } from '@/types/ApiResponse';


const page = () => {
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams<{ username: string }>();
  const username = params.username;
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  })
  const { register, watch, setValue, reset, getValues } = form;
  const messageContent = watch('content');
  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/send-message", {
        content: data.content,
        username
      });
      if (response.data.success) {
        toast({
          title: 'Success',
          description: response.data.message
        });
        reset({ ...getValues(), content: '' });

      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to sent message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className='min-h-screen relative'>
      <div className='container mx-auto my-8 p-6 max-w-4xl mt-5'>
        <h1 className='text-4xl font-bold text-center mb-6'>Public Profile Link</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your anonymous message here"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )} />
            <div className=' justify-center'></div>
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please Wait
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading || !messageContent}>Send</Button>
            )}
          </form>
        </Form>
      </div>
    </div>
  )
}

export default page
