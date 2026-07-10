
import Hero from "../components/Hero";
import Features from "../components/Features";
import Courses from "./Courses";
import WhyChooseUs from "../components/WhyChooseUs";
import WhoCanJoin from "../components/WhoCanJoin";
import Benefits from "../components/Benefits";
import LearningJourney from "../components/LearningJourney";
import PlacementStats from "../components/PlacementStats";
import Testimonials from "../components/Testimonials";
import ProgramFees from "../components/ProgramFees";
import ContactCTA from "../components/ContactCTA";


const Home = () => {
  return (
    <>
        <Hero />
        <Features />
        <Courses />
        <WhyChooseUs />
        <WhoCanJoin />
        <Benefits />
        <LearningJourney />
        <PlacementStats />
        <Testimonials />
        <ProgramFees />
        <ContactCTA />

    </>
  );
};

export default Home;