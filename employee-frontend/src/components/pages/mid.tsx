import Link from "next/link";
import { ModeToggle } from "../toggle";
import { Button } from "../ui/button";

export default function Mid() {
    return (
        <div className="text-center">
            <div className="flex flex-row justify-between w-[98vw] px-[2vw] py-[5vh] no-scrollbar">
                <Link href="/">
                    <Button variant="outline">Back</Button>
                </Link>
                <h1 className="text-3xl font-bold">BOOKINGS</h1>
                <ModeToggle />
            </div>
            <p className="text-lg mb-6">Choose your option</p>
            <div className="flex justify-center space-x-4">
                <Link href="/invalid">
                    <Button variant="outline">
                        INVALID
                    </Button>
                </Link>
                <Link href="/valid">
                    <Button variant="outline">
                        VALID
                    </Button>
                </Link>
            </div>
        </div>
    );
}