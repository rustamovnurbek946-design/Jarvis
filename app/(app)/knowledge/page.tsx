import { getProfile } from "@/lib/actions/profile";
import { KnowledgeClient } from "@/components/knowledge/knowledge-client";

export default async function KnowledgePage() {
  const profile = await getProfile();

  return (
    <KnowledgeClient
      initialKnowledgeBase={profile.knowledgeBase}
      initialAgentInstructions={profile.agentInstructions}
    />
  );
}
