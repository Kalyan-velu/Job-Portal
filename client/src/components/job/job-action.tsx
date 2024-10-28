import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useDeleteJobMutation } from "@/store/services/company.service"
import { Archive, Edit2, Trash2 } from "lucide-react"
import { forwardRef, memo, useCallback, type HTMLAttributes } from "react"
import { toast } from "sonner"

interface JobActionsProps extends HTMLAttributes<HTMLDivElement> {
  id: string;
}

const JobActions = memo(
  forwardRef<HTMLDivElement, JobActionsProps>(
    ({ className, id, ...props }, ref) => {
      const [deleteJob, { isLoading }] = useDeleteJobMutation();

      const handleDelete = useCallback(async () => {
        if (isLoading || !id) return;
        await deleteJob(id)
          .unwrap()
          .then(() => {
            toast.success("Job deleted successfully.");
          })
          .catch((e) => {
            toast.error(e);
          });
      }, [id]);

      return (
        <div ref={ref} className={cn("flex gap-2", className)} {...props}>
          <Button
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              // handleDelete();
            }}
            className="size-8"
            variant="outline"
          >
            <Archive />
          </Button>
          <Button size="icon" className="size-8" variant="outline">
            <Edit2 />
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            size="icon"
            className="size-8"
            variant="destructive"
          >
            <Trash2 />
          </Button>
        </div>
      );
    },
  ),
);

JobActions.displayName = "JobActions";
export { JobActions }

