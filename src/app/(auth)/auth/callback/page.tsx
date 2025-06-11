'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase as supabasePseudo } from "@/lib/supabase";

export default function CallbackPage() {
  const supabase = supabasePseudo;
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.push("/dashboard"); 
      }
    };

    checkSession();
  }, [router, supabase]);

  return <h1 className="text-center p-4">Please check your email for a confirmation message!</h1>;
}