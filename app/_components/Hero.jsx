import React from "react";
import Image from "next/image";
import { ContainerScroll } from "../../components/ui/container-scroll-animation";


function Hero() {
    return(
        <section className="bg-gray-150 flex items-center flex-col">
            <div className="flex flex-col overflow-hidden">
            <ContainerScroll
                titleComponent={
                <>
                    <h1 className="text-4xl font-semibold text-black dark:text-white">
                    Track Every Dollar, <br />
                    <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                    Master Your Financial Future. 
                    </span>
                    </h1>
                </>
                }
            >
                <Image
                src={`/dashboard.png`}
                alt="hero"
                height={720}
                width={1400}
                className="mx-auto rounded-2xl object-cover h-full object-left-top"
                draggable={false}
                />
            </ContainerScroll>
            </div>
        </section>
    )

}

export default Hero;