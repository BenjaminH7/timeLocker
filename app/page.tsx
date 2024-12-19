import Image from "next/image";
import Form from "./components/Form";
import { SessionProvider } from "next-auth/react";

export default function Home() {
  return (
    <SessionProvider>
      <div className="w-10/12 mx-auto mt-5">
        <Form />
      </div>
    </SessionProvider>
  );
}
