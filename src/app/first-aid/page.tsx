import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const firstAidTopics = [
    {
      id: "burns",
      title: "Minor Burns",
      steps: [
        "Cool the burn. Hold the burned area under cool (not cold) running water for about 10 minutes.",
        "Remove rings or other tight items from the burned area. Try to do this quickly and gently, before the area swells.",
        "Don't break blisters. Fluid-filled blisters protect against infection. If a blister breaks, clean the area with water.",
        "Apply lotion. Once a burn is completely cooled, apply a lotion, such as one with aloe vera or a moisturizer.",
        "Bandage the burn. Cover the burn with a sterile gauze bandage (not fluffy cotton).",
        "If needed, take an over-the-counter pain reliever, such as ibuprofen (Advil, Motrin IB, others), naproxen sodium (Aleve) or acetaminophen (Tylenol, others).",
      ],
    },
    {
      id: "choking",
      title: "Choking (Adult)",
      steps: [
        "Give 5 back blows. Stand to the side and just behind a choking adult. For a child, kneel down behind. Place one arm across the person's chest for support. Bend the person over at the waist so that the upper body is parallel with the ground. Deliver five separate back blows between the person's shoulder blades with the heel of your hand.",
        "Give 5 abdominal thrusts. Perform five abdominal thrusts (also known as the Heimlich maneuver).",
        "Alternate between 5 blows and 5 thrusts until the blockage is dislodged.",
      ],
    },
    {
      id: "bleeding",
      title: "Severe Bleeding",
      steps: [
        "Remove any obvious dirt or debris from the wound. Don't remove large or deeply embedded objects.",
        "Stop the bleeding. Place a sterile bandage or clean cloth on the wound. Press the bandage firmly with your palm to control bleeding. Apply constant pressure until the bleeding stops.",
        "Help the injured person lie down. If possible, place the person on a rug or blanket to prevent loss of body heat.",
        "Don't remove the gauze or bandage. If the bleeding seeps through the gauze or other cloth on the wound, add another bandage or cloth on top of it and keep pressing firmly on the area.",
        "Tourniquets: A tourniquet is effective in controlling life-threatening bleeding from a limb. Apply a commercial tourniquet if you're trained in how to do so. When emergency help arrives, explain how long the tourniquet has been in place.",
      ],
    },
     {
      id: "cpr",
      title: "Cardiopulmonary Resuscitation (CPR)",
      steps: [
        "Check the scene for safety, form an initial impression, and use personal protective equipment (PPE)",
        "If the person appears unresponsive, CHECK for responsiveness, breathing, life-threatening bleeding or other life-threatening conditions using shout-tap-shout.",
        "If the person does not respond and is not breathing or only gasping, CALL 9-1-1 and get equipment, or tell someone to do so. Place the person on their back on a firm, flat surface.",
        "Give 30 chest compressions. Hand position: Two hands centered on the chest. Body position: Shoulders directly over hands; elbows locked. Rate: 100 to 120 per minute.",
        "Give 2 breaths. Open the airway to a past-neutral position using the head-tilt/chin-lift technique. Ensure each breath lasts about 1 second and makes the chest rise; allow air to exit before giving the next breath.",
        "Continue giving sets of 30 chest compressions and 2 breaths. Use an AED as soon as one is available!",
      ],
    },
  ];

export default function FirstAidPage() {
  return (
    <Card className="shadow-md">
        <CardHeader>
            <CardTitle>Emergency First-Aid Guides</CardTitle>
            <CardDescription>
                Quick access to step-by-step guides for common medical emergencies. This information is not a substitute for professional medical advice.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Accordion type="single" collapsible className="w-full">
                {firstAidTopics.map((topic) => (
                    <AccordionItem value={topic.id} key={topic.id}>
                        <AccordionTrigger className="text-lg font-semibold">{topic.title}</AccordionTrigger>
                        <AccordionContent>
                           <ol className="list-decimal list-inside space-y-3 pl-4">
                            {topic.steps.map((step, index) => (
                                <li key={index} className="text-base">{step}</li>
                            ))}
                           </ol>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </CardContent>
    </Card>
  );
}
