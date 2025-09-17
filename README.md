# Billedekonverter

Billedekonverter er en fuldt lokal billedkonverter, der kører i din browser. Billedekonverter er rent klientside: intet uploades til en server eller lignende. Alle konverteringer sker i din browser, hvilket betyder, at dine filer aldrig forlader din computer.

**Prøv Billedekonverter lokalt ved at køre `npm run dev`**

## 🎥 Demo
![](demo.gif)

## ❓ Hvad gør Billedekonverter så speciel?
- **🔒 Sikker:** Da dine filer aldrig forlader din enhed, kan du bruge filer sikkert uden at bekymre dig om uautoriseret adgang til dem
- **📵 Virker offline:** Da Billedekonverter er rent klientside, har vi gjort den til en PWA, hvilket betyder, at du kan konvertere filer med Billedekonverter selvom du ikke er forbundet til internettet! Prøv det!

## 🚀 Funktioner
- **Fuldt lokal konvertering** - Ingen filer sendes til servere
- **PWA support** - Virker offline efter første besøg
- **Flere formater** - WEBP, JPG, PNG, GIF
- **Kvalitetsindstillinger** - Juster komprimering og kvalitet
- **Størrelsesændring** - Skalér billeder eller sæt maksimal bredde
- **Batch konvertering** - Konverter flere billeder på én gang
- **Automatisk download** - Konverterede filer downloades automatisk

## 🛠️ Teknisk stack
- **React** + **TypeScript** - Moderne frontend framework
- **Vite** - Hurtig build tool og dev server
- **Tailwind CSS** - Utility-first CSS framework
- **ImageMagick WASM** - Billedbehandling i browseren
- **PWA** - Progressive Web App funktionalitet

## 📦 Installation og kørsel
```bash
# Installer dependencies
npm install

# Kør development server
npm run dev

# Build til production
npm run build

# Preview production build
npm run preview
```

## 🔧 Forbedringer der kunne laves
- [ ] **Flere formater** - I stedet for kun billeder
- [ ] **Bedre fejlhåndtering** - Mere brugervenlig fejlhåndtering
- [ ] **Bedre tilgængelighed** - Gør appen mere tilgængelig for alle
- [ ] **Mindre WASM build** - Den nuværende er ~20MB, men understøtter mange formater via ImageMagick

## 🌍 Oversættelse
Appen er fuldt oversat til dansk. Alle brugergrænseflade-elementer, beskrivelser og fejlmeddelelser er på dansk for en bedre brugeroplevelse.

## Fork
Dette project er forked fra Doblar: https://github.com/Armster15/doblar 