'use client'
import { useToast } from "@/components/ui/use-toast";
import { Message } from "@/model/User"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useCallback, useState } from "react"
import { useForm } from "react-hook-form";

const page = () => {
  const [message, setMessage] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  
  const {toast} = useToast();
  const handleDeleteMessages = (messageId: string) => {
    setMessage(message.filter((message) => message._id !== messageId));
  }
  const {data: session} = useSession();//{data: session} as mentioned in documentation

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const {register, watch, setValue }= form;
  const acceptMessages = watch('acceptMessages');
  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessages',response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || 'failed to fetch messages settings',
        variant: 'destructive'
      })
    } finally {
      setIsSwitchLoading(false);
    }
  },[setValue]);

  return (
    <div>
      
    </div>
  )
}

export default page
