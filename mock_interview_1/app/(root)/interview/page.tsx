import InterviewForm from "@/components/InterviewForm";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = async () => {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] gap-6 w-full">
      <div className="text-center max-w-3xl">
        <h1 className="text-4xl font-bold mb-4">Create Your AI Interview</h1>
      </div>

      <InterviewForm 
        userName={user?.name!}
        userId={user?.id!}
      />
    </div>
  );
};

export default Page;