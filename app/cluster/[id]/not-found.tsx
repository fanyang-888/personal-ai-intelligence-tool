import { NotFoundState } from "@/components/shared/not-found-state";

export default function ClusterNotFound() {
  return (
    <NotFoundState
      title="Story cluster not found"
      message="That cluster id is not in the local mock catalog."
    />
  );
}
