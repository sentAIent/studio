
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import DashboardLayout from '@/components/dashboard-layout';
import Image from 'next/image';
import {
  Plane,
  Bed,
  Utensils,
  Camera,
  MapPin,
  Landmark,
} from 'lucide-react';

const itineraryData = [
  {
    day: 1,
    title: 'Arrival in Rome & Ancient Wonders',
    activities: [
      {
        time: '2:00 PM',
        description: 'Arrive at Fiumicino Airport (FCO) & Transfer',
        icon: Plane,
        details: 'Collect your luggage and meet your private driver.',
      },
      {
        time: '4:00 PM',
        description: 'Hotel Check-in',
        icon: Bed,
        details: 'Check into Hotel Artemide, near the city center.',
      },
      {
        time: '5:00 PM',
        description: 'Explore the Colosseum',
        icon: Landmark,
        details:
          'Guided tour of the iconic amphitheater, a testament to Roman engineering.',
      },
      {
        time: '8:00 PM',
        description: 'Dinner in Trastevere',
        icon: Utensils,
        details:
          'Enjoy a classic Roman dinner at "Da Enzo al 29" in the charming Trastevere district.',
      },
    ],
  },
  {
    day: 2,
    title: 'Vatican City & Renaissance Art',
    activities: [
      {
        time: '9:00 AM',
        description: "St. Peter's Basilica",
        icon: Landmark,
        details:
          "Explore the heart of the Catholic world and climb the dome for panoramic city views.",
      },
      {
        time: '12:00 PM',
        description: 'Vatican Museums & Sistine Chapel',
        icon: Camera,
        details:
          "Marvel at Michelangelo's masterpieces and the vast collection of Renaissance art.",
      },
      {
        time: '3:00 PM',
        description: 'Lunch near Vatican',
        icon: Utensils,
        details: 'Grab a quick and delicious pizza slice at "Pizzarium Bonci".',
      },
      {
        time: '5:00 PM',
        description: 'Castel Sant\'Angelo',
        icon: Landmark,
        details: 'Walk across the Ponte Sant\'Angelo and explore the ancient mausoleum.',
      },
    ],
  },
  {
    day: 3,
    title: 'Art, Fountains & Farewell',
    activities: [
      {
        time: '10:00 AM',
        description: 'Borghese Gallery and Museum',
        icon: Camera,
        details: 'View stunning sculptures by Bernini and paintings by Caravaggio. Reservations essential.',
      },
      {
        time: '1:00 PM',
        description: 'Trevi Fountain & Pantheon',
        icon: MapPin,
        details: 'Toss a coin in the famous fountain and admire the architectural marvel of the Pantheon.',
      },
      {
        time: '3:00 PM',
        description: 'Spanish Steps & Final Gelato',
        icon: Utensils,
        details: 'Enjoy a final gelato at the iconic Spanish Steps before heading to the airport.',
      },
       {
        time: '6:00 PM',
        description: 'Departure from Fiumicino (FCO)',
        icon: Plane,
        details: 'Depart from Rome with unforgettable memories.',
      },
    ],
  },
];

export default function ItineraryPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
            <div className="relative h-64 w-full rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/20 border border-cyan-400/20">
                <Image
                    src="https://picsum.photos/seed/rome/1200/400"
                    alt="Image of Rome"
                    fill={true}
                    className="object-cover"
                    data-ai-hint="historic rome"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                     <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                        Trip to Rome
                    </h2>
                    <p className="mt-2 text-lg text-cyan-200/80">
                        3 Days of History, Art, and "La Dolce Vita"
                    </p>
                </div>
            </div>
        </div>

        <Accordion
          type="single"
          collapsible
          defaultValue="item-0"
          className="w-full space-y-4"
        >
          {itineraryData.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-slate-900/50 backdrop-blur-sm border-cyan-400/20 border rounded-xl overflow-hidden"
            >
              <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-cyan-300 hover:text-cyan-200 hover:no-underline [&[data-state=open]]:bg-cyan-500/10">
                <div className="flex items-center gap-4">
                    <div className="bg-cyan-500/20 text-cyan-300 rounded-lg px-3 py-1 text-sm font-bold">
                        Day {item.day}
                    </div>
                    <span>{item.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 text-cyan-100/90">
                <div className="border-l-2 border-cyan-400/30 pl-6 space-y-6">
                    {item.activities.map((activity, actIndex) => (
                         <div key={actIndex} className="relative">
                            <div className="absolute -left-[34px] top-1.5 h-4 w-4 rounded-full bg-cyan-400 border-4 border-slate-800" />
                            <div className="flex items-start gap-4">
                                <div className="w-24 text-right font-medium text-cyan-300/80">{activity.time}</div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-cyan-200 flex items-center gap-2">
                                        <activity.icon className="w-4 h-4 text-cyan-400" />
                                        {activity.description}
                                    </h4>
                                    <p className="mt-1 text-sm text-cyan-100/70">{activity.details}</p>
                                </div>
                            </div>
                         </div>
                    ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </DashboardLayout>
  );
}
