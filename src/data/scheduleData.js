import {
    Calendar,
    Code,
    Camera,
    Gamepad,
    Music,
    Search,
    Monitor,
    Utensils,
    Coffee,
    Mic
} from 'lucide-react';

export const scheduleData = [
    {
        id: 1,
        title: "Registration",
        time: "09:30 AM - 10:30 AM",
        venue: "Registration Counter",
        icon: Calendar,
        category: "general"
    },
    {
        id: 2,
        title: "Inauguration",
        time: "10:00 AM - 10:40 AM",
        venue: "Conference Hall",
        icon: Mic,
        category: "general"
    },
    {
        id: 3,
        title: "Debugging Prelims",
        time: "10:50 AM - 11:15 AM",
        venue: "Computer Lab",
        icon: Code,
        category: "technical"
    },
    {
        id: 4,
        title: "Image Prompting Prelims",
        time: "11:20 AM - 11:50 AM",
        venue: "Computer Lab",
        icon: Camera,
        category: "creative"
    },
    {
        id: 5,
        title: "Treasure Hunt",
        time: "11:00 AM - 04:00 PM",
        venue: "Cyber Security II Year Class Room",
        icon: Search,
        category: "fun"
    },
    {
        id: 6,
        title: "Photography",
        time: "11:00 AM - 04:00 PM",
        venue: "Seminar Hall",
        icon: Camera,
        category: "creative"
    },
    {
        id: 7,
        title: "Gaming Sponsor Interaction",
        time: "11:55 AM - 12:05 PM",
        venue: "Seminar Hall",
        icon: Gamepad,
        iconClassName: "text-green-500",
        category: "gaming"
    },
    {
        id: 8,
        title: "Gaming",
        time: "12:10 PM - 01:35 PM",
        venue: "Seminar Hall",
        icon: Gamepad,
        category: "gaming"
    },
    {
        id: 9,
        title: "Lunch Break",
        time: "01:00 PM - 01:45 PM",
        venue: "Food Plaza",
        icon: Utensils,
        category: "break"
    },
    {
        id: 10,
        title: "Web Design Prelims",
        time: "01:45 PM - 02:05 PM",
        venue: "Computer Lab",
        icon: Monitor,
        category: "technical"
    },
    {
        id: 11,
        title: "Debugging Final",
        time: "02:10 PM - 03:10 PM",
        venue: "Computer Lab",
        icon: Code,
        category: "technical"
    },
    {
        id: 12,
        title: "Image Prompting Final",
        time: "03:15 PM - 03:45 PM",
        venue: "Computer Lab",
        icon: Camera,
        category: "creative"
    },
    {
        id: 13,
        title: "Web Design Final",
        time: "03:50 PM - 05:00 PM",
        venue: "Computer Lab",
        icon: Monitor,
        category: "technical"
    },
    {
        id: 14,
        title: "Refreshment",
        time: "04:00 PM - 04:30 PM",
        venue: "Food Plaza",
        icon: Coffee,
        category: "break"
    },
    {
        id: 15,
        title: "Prize Distribution & Cultural Extravaganza",
        time: "06:00 PM - 07:15 PM",
        venue: "Open Auditorium",
        icon: Music,
        category: "general"
    },
    {
        id: 16,
        title: "Music Fiesta",
        time: "07:15 PM - 09:00 PM",
        venue: "Open Auditorium",
        icon: Music,
        category: "fun"
    },
    {
        id: 17,
        title: "Appreciation & Vote of Thanks",
        time: "9:00 PM",
        venue: "Open Auditorium",
        icon: Mic,
        category: "general"
    },
    {
        id: 19,
        title: "Dinner",
        time: "Onwards",
        venue: "Food Plaza",
        icon: Utensils,
        category: "break"
    }
];
