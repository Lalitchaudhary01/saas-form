import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 ">
      <Button>Let's buidl somethng crazy </Button>
      <h1 className="text-3xl hover:text-primary"> Welcome to Saas Starter</h1>
    </div>
  );
}
