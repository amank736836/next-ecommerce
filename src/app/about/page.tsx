"use client";

import { FaTshirt, FaShippingFast, FaUndo, FaLeaf, FaUserFriends, FaGlobe, FaRobot, FaGem, FaHandshake } from "react-icons/fa";

const About = () => {
    return (
        <div className="about-page" style={{ padding: "10rem 2rem 2rem", maxWidth: "1200px", margin: "0 auto", lineHeight: "1.6", color: "#333" }}>
            <section style={{ marginBottom: "3rem", textAlign: "center" }}>
                <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
                    <FaTshirt /> About VirtuoStore
                </h1>
                <p style={{ fontSize: "1.1rem", maxWidth: "800px", margin: "0 auto" }}>
                    Welcome to VirtuoStore, your ultimate destination for stylish and high-quality fashion essentials. We specialize in bringing you the latest trends in T-shirts, pants, and shoes, ensuring that you always step out in confidence. At VirtuoStore, we believe that fashion is more than just clothing—it’s an expression of individuality, style, and personality.
                </p>
            </section>

            <section style={{ marginBottom: "2.5rem" }}>
                <h2 style={{ fontSize: "1.8rem", fontWeight: "600", marginBottom: "1rem", color: "#000", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <FaUserFriends /> Who We Are
                </h2>
                <p>
                    VirtuoStore is more than just an e-commerce platform; we are a brand dedicated to redefining fashion by making high-quality apparel and footwear accessible to everyone. Whether you're looking for trendy T-shirts, comfortable yet stylish pants, or the perfect pair of shoes, we have something to match every personality and occasion.
                </p>
            </section>

            <section style={{ marginBottom: "2.5rem" }}>
                <h2 style={{ fontSize: "1.8rem", fontWeight: "600", marginBottom: "1rem", color: "#000", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <FaGem /> Our Mission & Vision
                </h2>
                <div style={{ paddingLeft: "1rem", borderLeft: "4px solid #f97316" }}>
                    <h3 style={{ fontSize: "1.4rem", fontWeight: "500", marginBottom: "0.5rem" }}>Mission</h3>
                    <p style={{ marginBottom: "1rem" }}>
                        Our mission is to redefine the fashion shopping experience by offering high-quality, trendy, and affordable apparel and footwear. We aim to bring style, comfort, and affordability together under one roof, allowing our customers to express themselves effortlessly through fashion.
                    </p>
                    <h3 style={{ fontSize: "1.4rem", fontWeight: "500", marginBottom: "0.5rem" }}>Vision</h3>
                    <p>
                        We envision VirtuoStore as a leading online fashion hub, providing customers with a seamless shopping experience, a vast selection of trendy products, and the best-in-class customer service.
                    </p>
                </div>
            </section>

            <section style={{ marginBottom: "2.5rem" }}>
                <h2 style={{ fontSize: "1.8rem", fontWeight: "600", marginBottom: "1rem", color: "#000" }}>What Sets Us Apart?</h2>
                <ul style={{ listStyleType: "none", padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
                    {[
                        { title: "Curated Fashion Selection", desc: "T-Shirts, Pants, and Shoes.", icon: <FaTshirt /> },
                        { title: "Quality Assurance", desc: "Premium materials and craftsmanship.", icon: <FaGem /> },
                        { title: "Affordable Pricing", desc: "Budget-friendly without compromising quality.", icon: <FaHandshake /> },
                        { title: "Seamless Shopping Experience", desc: "Easy-to-use website with secure checkout.", icon: <FaGlobe /> },
                        { title: "Fast & Reliable Shipping", desc: "Ensuring timely delivery.", icon: <FaShippingFast /> },
                        { title: "Hassle-Free Returns & Exchanges", desc: "Quick and easy process.", icon: <FaUndo /> },
                        { title: "Customer-Centric Approach", desc: "Dedicated support team.", icon: <FaUserFriends /> },
                        { title: "Eco-Friendly Fashion", desc: "Sustainable and ethical sourcing.", icon: <FaLeaf /> }
                    ].map((item, index) => (
                        <li key={index} style={{ backgroundColor: "#f9f9f9", padding: "1rem", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <span style={{ fontSize: "1.5rem", color: "#f97316" }}>{item.icon}</span>
                            <div>
                                <strong>{item.title}:</strong> {item.desc}
                            </div>
                        </li>
                    ))}
                </ul>
            </section>

            <section style={{ marginBottom: "2.5rem" }}>
                <h2 style={{ fontSize: "1.8rem", fontWeight: "600", marginBottom: "1rem", color: "#000", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <FaRobot /> Our Growth & Future Plans
                </h2>
                <ul style={{ listStyleType: "disc", paddingLeft: "1.5rem" }}>
                    <li>Expanding our collection with new fashion categories.</li>
                    <li>Exclusive designer collaborations for unique styles.</li>
                    <li>AI-powered fashion recommendations.</li>
                    <li>More eco-friendly products and sustainable packaging.</li>
                    <li>Expanding globally to reach more customers worldwide.</li>
                </ul>
            </section>

            <section style={{ marginBottom: "2.5rem", textAlign: "center", backgroundColor: "#0f172a", color: "white", padding: "2rem", borderRadius: "10px" }}>
                <h2 style={{ fontSize: "1.8rem", fontWeight: "600", marginBottom: "1rem" }}>Join the VirtuoStore Family!</h2>
                <p>
                    At VirtuoStore, we believe that fashion is for everyone. Whether you're dressing up for a special occasion or looking for everyday essentials, we've got you covered.
                </p>
            </section>

            <section>
                <h2 style={{ fontSize: "1.8rem", fontWeight: "600", marginBottom: "1rem", color: "#000" }}>Contact Us</h2>
                <p><strong>Email:</strong> amankkarguwal@gmail.com</p>
                <p><strong>Website:</strong> virtuostore.vercel.app</p>
            </section>

            <footer style={{ marginTop: "3rem", textAlign: "center", fontSize: "0.9rem", color: "#666", borderTop: "1px solid #eaeaea", paddingTop: "1rem" }}>
                Virtuo Store © 2025 | All rights reserved.
            </footer>
        </div>
    );
};

export default About;
