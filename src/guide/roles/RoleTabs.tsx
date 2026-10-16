import { GuideTabs } from "../../components/ui/GuideTabs";
import { ROLES, type RoleKey } from "../../data/roles";
import { SequenceReveal } from "../../fx/SequenceReveal";
import { RoleExampleCard } from "./RoleExampleCard";

export function RoleTabs({ active, onChange, focusRequest }: { active: RoleKey; onChange: (key: RoleKey) => void; focusRequest: number }) {
  return (
    <GuideTabs
      active={active}
      onChange={onChange}
      focusRequest={focusRequest}
      ariaLabel="Kinds of work"
      items={ROLES.map((role) => ({
        value: role.key,
        label: role.label,
        panel: (
          <>
            <p className="role-intro">{role.intro}</p>
            <SequenceReveal revealKey={role.key} className="cards">
              {role.cards.map((card) => <RoleExampleCard key={card.area + card.prompt} card={card} />)}
            </SequenceReveal>
          </>
        ),
      }))}
    />
  );
}
