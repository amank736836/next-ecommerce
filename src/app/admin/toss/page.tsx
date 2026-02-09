"use client";

import { useState } from "react";

const Toss = () => {
    const [angle, setAngle] = useState<number>(0);

    const flipCoin = () => {
        if (Math.random() > 0.5) {
            setAngle((prevAngle) => prevAngle + 180);
        } else {
            setAngle((prevAngle) => prevAngle + 360);
        }
    };

    return (
        <main className="dashboardAppContainer">
            <h1>Toss</h1>
            <section>
                <article
                    className="tossCoin"
                    onClick={flipCoin}
                    style={{
                        transform: `rotateY(${angle}deg)`,
                    }}
                >
                    <div></div>
                    <div></div>
                </article>
            </section>
        </main>
    );
};

export default Toss;
