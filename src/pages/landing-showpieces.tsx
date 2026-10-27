import { SectionHeading } from "@/demo/block-data";
import { Tile } from "@/demo/demo-parts";
import {
  DemoBars,
  DemoBookTurn,
  DemoClock,
  DemoCoin,
  DemoCounter,
  DemoCylinder,
  DemoEnvelope,
  DemoExtrude,
  DemoFolder,
  DemoGlobe,
  DemoKnobs,
  DemoLaptop,
  DemoPhone,
  DemoGem,
  DemoCan,
  DemoTorus,
  DemoGift,
  DemoRoom,
  DemoTesseract,
  DemoSaturn,
  DemoRocket,
  DemoPinwheel,
  DemoLantern,
  DemoDisco,
  DemoAnalogClock,
  DemoPopUp,
  DemoSnowGlobe,
  DemoOrrery,
  DemoIsland,
  DemoReorder,
  DemoExpand,
  DemoTabs,
  DemoAccordion,
  DemoDice,
  DemoTicket,
  DemoFan,
  DemoPeel,
  DemoTurntable,
  DemoSlots,
  DemoCradle,
  DemoShelf,
  DemoPrism,
  DemoDoors,
  DemoRubik,
  DemoHourglass,
  DemoGyro,
  DemoBadge,
  DemoPyramid,
  DemoHelix,
  DemoVault,
  DemoFold,
  DemoEightBall,
  DemoCompass,
  DemoTunnel,
  DemoPinArt,
  DemoTileFlip,
  DemoTrail,
  DemoScrollStack,
  DemoRadial,
  DemoWheel,
  DemoTagCloud,
  DemoNotifs,
  DemoPanels,
  DemoWall,
} from "@/demo/showpiece-demos";

/** The showpiece grid on the landing page. Lazy-loaded; each tile also mounts only near the viewport. */
export default function LandingShowpieces() {
  return (
    <>

          <SectionHeading eyebrow="Showpieces" title="The ones people screenshot" description="Sixty-three signature pieces: a wireframe globe, split-flap clock, page-turning book, 3D charts and more." />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            <Tile label="Globe (drag it)"><DemoGlobe /></Tile>
            <Tile label="Coin (click it)"><DemoCoin /></Tile>
            <Tile label="Text cylinder"><DemoCylinder /></Tile>
            <Tile label="Flip clock" className="md:col-span-2"><div className="flex flex-col items-center gap-8"><DemoClock /><DemoCounter /></div></Tile>
            <Tile label="Notification stack" className="items-stretch"><DemoNotifs /></Tile>
            <Tile label="Page turn" className="md:col-span-2 min-h-[440px]"><DemoBookTurn /></Tile>
            <Tile label="Expanding panels" className="md:col-span-2 lg:col-span-1 min-h-[400px]"><DemoPanels /></Tile>
            <Tile label="3D bar chart" className="md:col-span-2"><DemoBars /></Tile>
            <Tile label="Wheel picker"><DemoWheel /></Tile>
            <Tile label="Radial menu (click +)"><DemoRadial /></Tile>
            <Tile label="Extrude (drag it)" className="md:col-span-2"><DemoExtrude /></Tile>
            <Tile label="Knobs (drag up or down)"><DemoKnobs /></Tile>
            <Tile label="Laptop (opens as you scroll)" className="md:col-span-2 lg:col-span-3 min-h-[460px]"><DemoLaptop /></Tile>
            <Tile label="Tag cloud (drag it)" className="md:col-span-2 lg:col-span-1 min-h-[420px]"><DemoTagCloud /></Tile>
            <Tile label="Phone"><DemoPhone /></Tile>
            <Tile label="Folder"><DemoFolder /></Tile>
            <Tile label="Envelope (click it)" className="md:col-span-2 lg:col-span-3"><DemoEnvelope /></Tile>
            <Tile label="Dice (click to roll)"><DemoDice /></Tile>
            <Tile label="Ticket (click to tear)" className="md:col-span-2"><DemoTicket /></Tile>
            <Tile label="Card fan" className="md:col-span-2 lg:col-span-2 min-h-[420px]"><DemoFan /></Tile>
            <Tile label="Peel card"><DemoPeel /></Tile>
            <Tile label="Turntable" className="md:col-span-2 lg:col-span-3"><DemoTurntable /></Tile>
            <Tile label="Slot machine"><DemoSlots /></Tile>
            <Tile label="Newton's cradle (click)" className="md:col-span-2"><DemoCradle /></Tile>
            <Tile label="Bookshelf (point at a book)" className="md:col-span-2 lg:col-span-2"><DemoShelf /></Tile>
            <Tile label="Prism"><DemoPrism /></Tile>
            <Tile label="Doors" className="md:col-span-2 lg:col-span-3"><DemoDoors /></Tile>
            <Tile label="Puzzle cube (drag, scramble)" className="md:col-span-2"><DemoRubik /></Tile>
            <Tile label="Hourglass (click to flip)"><DemoHourglass /></Tile>
            <Tile label="Gyroscope"><DemoGyro /></Tile>
            <Tile label="Badge (drag to swing)" className="md:col-span-2 lg:col-span-1 min-h-[480px]"><DemoBadge /></Tile>
            <Tile label="Pyramid (drag it)"><DemoPyramid /></Tile>
            <Tile label="Helix"><DemoHelix /></Tile>
            <Tile label="Vault (crack the code)" className="md:col-span-2 min-h-[460px]"><DemoVault /></Tile>
            <Tile label="Folding screen" className="md:col-span-2 lg:col-span-2"><DemoFold /></Tile>
            <Tile label="Magic 8 Ball (click)"><DemoEightBall /></Tile>
            <Tile label="Compass (move your mouse)" className="md:col-span-2 lg:col-span-3"><DemoCompass /></Tile>
            <Tile label="Tunnel (hover to speed up)" className="md:col-span-2 lg:col-span-3 !p-0"><DemoTunnel /></Tile>
            <Tile label="Pin art (move over it)" className="md:col-span-2"><DemoPinArt /></Tile>
            <Tile label="Tile flip (click a tile)"><DemoTileFlip /></Tile>
            <Tile label="Image trail (move your pointer)" className="md:col-span-2 lg:col-span-2"><DemoTrail /></Tile>
            <Tile label="Stack scroll (scroll inside)"><DemoScrollStack /></Tile>
            <Tile label="Dynamic island (switch states)" className="md:col-span-2"><DemoIsland /></Tile>
            <Tile label="Reorder list (drag a row)"><DemoReorder /></Tile>
            <Tile label="Expanding cards (click one)" className="md:col-span-2 lg:col-span-2"><DemoExpand /></Tile>
            <Tile label="3D tabs"><DemoTabs /></Tile>
            <Tile label="3D accordion" className="md:col-span-2 lg:col-span-3"><DemoAccordion /></Tile>
            <Tile label="Disco ball"><DemoDisco /></Tile>
            <Tile label="Analog clocks (tilt them)" className="md:col-span-2"><DemoAnalogClock /></Tile>
            <Tile label="Pop-up book (hover it)" className="md:col-span-2 lg:col-span-2"><DemoPopUp /></Tile>
            <Tile label="Snow globe (click to shake)"><DemoSnowGlobe /></Tile>
            <Tile label="Orrery (hover to pause)" className="md:col-span-2 lg:col-span-3"><DemoOrrery /></Tile>
            <Tile label="Gem"><DemoGem /></Tile>
            <Tile label="Cans (hover to pause)" className="md:col-span-2"><DemoCan /></Tile>
            <Tile label="Torus (hover to pause)"><DemoTorus /></Tile>
            <Tile label="Gift box (hover it)" className="md:col-span-2"><DemoGift /></Tile>
            <Tile label="Room (drag to look around)" className="md:col-span-2 lg:col-span-3"><DemoRoom /></Tile>
            <Tile label="Tesseract (hover to pause)"><DemoTesseract /></Tile>
            <Tile label="Saturn" className="md:col-span-2"><DemoSaturn /></Tile>
            <Tile label="Rocket (hover to launch)"><DemoRocket /></Tile>
            <Tile label="Pinwheels (hover to spin up)" className="md:col-span-2"><DemoPinwheel /></Tile>
            <Tile label="Lanterns (hover to pause)" className="md:col-span-2"><DemoLantern /></Tile>
            <Tile label="Gallery wall" className="md:col-span-2 lg:col-span-3 !p-0"><DemoWall /></Tile>
          </div>
        
    </>
  );
}
