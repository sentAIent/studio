'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import DashboardLayout from '@/components/dashboard-layout';
import { Plane } from 'lucide-react';

const itineraryData = [
  {
    day: 1,
    title: 'Arrival in Rome & Ancient Wonders',
    details:
      'Arrive at Fiumicino Airport (FCO), transfer to your hotel. In the afternoon, explore the Colosseum, Roman Forum, and Palatine Hill. Enjoy a classic Roman dinner in the Trastevere district.',
  },
  {
    day: 2,
    title: 'Vatican City & Renaissance Art',
    details:
      "Spend the day exploring Vatican City. Visit St. Peter's Basilica, climb the dome for a panoramic view, and marvel at the masterpieces in the Vatican Museums, including the Sistine Chapel.",
  },
  {
    day: 3,
    title: 'Art, Fountains & Farewell',
    details:
      "Morning visit to the Borghese Gallery and Museum (reservations essential). Afterwards, toss a coin in the Trevi Fountain, admire the Pantheon, and enjoy a final gelato at the Spanish Steps before departing.",
  },
];

export default function ItineraryPage() {
  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <Plane className="w-16 h-16 mx-auto mb-4 text-cyan-400" />
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Trip to Rome
          </h2>
          <p className="mt-4 text-lg text-cyan-200/80">
            3 Days of History, Art, and "La Dolce Vita"
          </p>
        </div>

        <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
          {itineraryData.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-slate-900/50 backdrop-blur-sm border-cyan-400/20 border rounded-lg mb-4"
            >
              <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-cyan-300 hover:text-cyan-200">
                Day {item.day}: {item.title}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 text-cyan-100/90">
                {item.details}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </DashboardLayout>
  );
}
