// Station Data for All Lines
const transitData = {
    mrt3: {
        name: "MRT-3",
        color: "#0066b3",
        stations: [
            "North Avenue",
            "Quezon Avenue",
            "Kamuning",
            "Araneta Center-Cubao",
            "Santolan-Annapolis",
            "Ortigas",
            "Shaw Boulevard",
            "Boni",
            "Guadalupe",
            "Buendia",
            "Ayala",
            "Magallanes",
            "Taft Avenue"
        ]
    },
    lrt1: {
        name: "LRT-1",
        color: "#00994d",
        stations: [
            "Roosevelt",
            "Balintawak",
            "Monumento",
            "5th Avenue",
            "R. Papa",
            "Abad Santos",
            "Blumentritt",
            "Tayuman",
            "Doroteo Jose",
            "Carriedo",
            "Central",
            "United Nations",
            "Pedro Gil",
            "Quirino",
            "Vito Cruz",
            "Gil Puyat",
            "Libertad",
            "EDSA",
            "Baclaran"
        ]
    },
    lrt2: {
        name: "LRT-2",
        color: "#800080",
        stations: [
            "Recto",
            "Legarda",
            "Pureza",
            "V. Mapa",
            "J. Ruiz",
            "Gilmore",
            "Betty Go-Belmonte",
            "Araneta Center-Cubao",
            "Anonas",
            "Katipunan",
            "Santolan",
            "Marikina",
            "Antipolo"
        ]
    },
    edsacarousel: {
        name: "EDSA Carousel",
        color: "#ff6600",
        stations: [
            "Monumento",
            "Bagong Barrio",
            "Balintawak",
            "Kaining",
            "Roosevelt/Munoz",
            "SM North EDSA",
            "North Avenue",
            "Philam",
            "Quezon Avenue",
            "Kamuning",
            "Nepa Q‑Mart",
            "Main Avenue",
            "Santolan",
            "Ortigas",
            "Guadalupe",
            "Buendia",
            "One Ayala Terminal",
            "Tramo Carousel Station",
            "Taft Avenue",
            "Roxas Boulevard",
            "SM Mall of Asia",
            "DFA Aseana",
            "Ayala Malls Manila Bay",
            "PITX",
        ]
    }
};

// Fare Matrix (simplified - in real app, this would be more comprehensive)
const fareMatrix = {
    "mrt3": {
        baseFare: 13,
        perStation: 1.05 // approximate
    },
    "lrt1": {
        baseFare: 15,
        perStation: 1.15
    },
    "lrt2": {
        baseFare: 13,
        perStation: 1.05
    },
    "edsacarousel": {
        baseFare: 15,
        perStation: 2.75
    }
};

// Station landmarks (for "Am I here?" feature)
const stationLandmarks = {
    "North Avenue": ["SM North EDSA", "Trinoma", "Sky Garden"],
    "Quezon Avenue": ["Quezon Memorial Circle", "PEA", "Centris"],
    "Araneta Center-Cubao": ["Gateway Mall", "Farmers Plaza", "Ali Mall"],
    "Taft Avenue": ["SM Manila", "St. Paul University", "DLSU"],
    "Doroteo Jose": ["Isetann", "Recto Avenue", "Divisoria"],
    "EDSA": ["SM Mall of Asia", "Taft Avenue", "MRT-3 Taft Station"],
    // Add more as needed
};

// Transfer points (stations where you can switch lines)
const transferPoints = {
    "Araneta Center-Cubao": ["MRT-3", "LRT-2"],
    "Doroteo Jose": ["LRT-1", "LRT-2"],
    "EDSA": ["LRT-1", "MRT-3"],
    "Recto": ["LRT-2", "LRT-1"],
    "Taft Avenue": ["MRT-3", "LRT-1"]
};