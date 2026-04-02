import { NotFoundState } from "@/components/shared/not-found-state";

export default function DraftNotFound() {
  return (
    <NotFoundState
      title="Draft not found"
      message="That draft id is not in the local mock catalog."
    />
  );
}
