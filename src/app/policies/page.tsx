"use client";

import { useState } from "react";

import { FaFileContract, FaUndo, FaUserShield, FaShippingFast } from "react-icons/fa";

const Policies = () => {
    const [activeTab, setActiveTab] = useState<
        "terms" | "refund" | "privacy" | "shipping"
    >("terms");

    return (
        <div className="policy-page" style={{ padding: "10rem 2rem 2rem", maxWidth: "1200px", margin: "0 auto" }}>
            <div className="policy-tabs" style={{ marginBottom: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <button
                    onClick={() => setActiveTab("terms")}
                    style={{
                        padding: "0.75rem 1.5rem",
                        backgroundColor: activeTab === "terms" ? "#0f172a" : "#f1f5f9",
                        color: activeTab === "terms" ? "white" : "#334155",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontWeight: "600",
                        transition: "all 0.3s ease"
                    }}
                >
                    <FaFileContract /> Terms
                </button>
                <button
                    onClick={() => setActiveTab("refund")}
                    style={{
                        padding: "0.75rem 1.5rem",
                        backgroundColor: activeTab === "refund" ? "#0f172a" : "#f1f5f9",
                        color: activeTab === "refund" ? "white" : "#334155",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontWeight: "600",
                        transition: "all 0.3s ease"
                    }}
                >
                    <FaUndo /> Refund
                </button>
                <button
                    onClick={() => setActiveTab("privacy")}
                    style={{
                        padding: "0.75rem 1.5rem",
                        backgroundColor: activeTab === "privacy" ? "#0f172a" : "#f1f5f9",
                        color: activeTab === "privacy" ? "white" : "#334155",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontWeight: "600",
                        transition: "all 0.3s ease"
                    }}
                >
                    <FaUserShield /> Privacy
                </button>
                <button
                    onClick={() => setActiveTab("shipping")}
                    style={{
                        padding: "0.75rem 1.5rem",
                        backgroundColor: activeTab === "shipping" ? "#0f172a" : "#f1f5f9",
                        color: activeTab === "shipping" ? "white" : "#334155",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontWeight: "600",
                        transition: "all 0.3s ease"
                    }}
                >
                    <FaShippingFast /> Shipping
                </button>
            </div>

            <div className="policy-content" style={{ backgroundColor: "#f9f9f9", padding: "2rem", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                {activeTab === "terms" && (
                    <section>
                        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Virtuo Store</h1>
                        <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Terms & Conditions</h2>
                        <p style={{ marginBottom: "1rem" }}><strong>By using Virtuo Store, you agree to the following terms and conditions:</strong></p>

                        <h3 style={{ fontSize: "1.2rem", marginTop: "1.5rem", marginBottom: "0.5rem" }}>Service Agreement:</h3>
                        <p>Virtuo Store provides e-commerce services as per the listed product details.</p>
                        <p>We reserve the right to update prices and product availability at any time.</p>

                        <h3 style={{ fontSize: "1.2rem", marginTop: "1.5rem", marginBottom: "0.5rem" }}>Payments:</h3>
                        <p>All payments must be made in advance through our secure payment system.</p>
                        <p>Failure to complete payment may result in order cancellation.</p>

                        <h3 style={{ fontSize: "1.2rem", marginTop: "1.5rem", marginBottom: "0.5rem" }}>Shipping & Delivery:</h3>
                        <p>Orders are processed within 2-5 business days and delivered within 5-10 days across India.</p>
                        <p>We are not responsible for delays caused by shipping carriers.</p>

                        <h3 style={{ fontSize: "1.2rem", marginTop: "1.5rem", marginBottom: "0.5rem" }}>Returns & Refunds:</h3>
                        <p>Refunds are applicable only for defective or incorrect products.</p>
                        <p>Customers must initiate refund requests within 7 days of delivery.</p>

                        <h3 style={{ fontSize: "1.2rem", marginTop: "1.5rem", marginBottom: "0.5rem" }}>Intellectual Property:</h3>
                        <p>All website content, including images and text, is the property of Virtuo Store.</p>
                        <p>Unauthorized use or reproduction of any content is strictly prohibited.</p>

                        <h3 style={{ fontSize: "1.2rem", marginTop: "1.5rem", marginBottom: "0.5rem" }}>Limitation of Liability:</h3>
                        <p>We are not responsible for third-party service failures (e.g., payment gateways, shipping providers).</p>
                        <p>We do not guarantee specific product results or performance outcomes.</p>

                        <h3 style={{ fontSize: "1.2rem", marginTop: "1.5rem", marginBottom: "0.5rem" }}>Termination:</h3>
                        <p>We reserve the right to cancel orders or restrict access if a customer violates our policies.</p>
                        <p>By using our services, you agree to these terms. For any questions, contact us at support@virtuostore.in.</p>
                    </section>
                )}

                {activeTab === "refund" && (
                    <section>
                        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Virtuo Store</h1>
                        <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Refund Policy</h2>
                        <p style={{ marginBottom: "1rem" }}>At **Virtuo Store**, we strive to provide the best shopping experience for our customers. If you wish to request a refund, please review our policy below.</p>

                        <h3 style={{ fontSize: "1.2rem", marginTop: "1.5rem", marginBottom: "0.5rem" }}>Cancellation & Refund Eligibility:</h3>
                        <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                            <li>Orders can be canceled within **12 hours** of purchase for a full refund.</li>
                            <li>Once an order has been shipped, it is not eligible for cancellation.</li>
                            <li>Refunds are only applicable for defective, damaged, or incorrect products received.</li>
                        </ul>

                        <h3 style={{ fontSize: "1.2rem", marginTop: "1.5rem", marginBottom: "0.5rem" }}>Process for Refund:</h3>
                        <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                            <li>To request a refund, email us at **support@virtuostore.in** with your order details and reason for the refund.</li>
                            <li>Refunds will be processed within **7-10 business days** via the original payment method.</li>
                            <li>In case of a damaged or incorrect product, customers may be required to share images or return the item.</li>
                        </ul>

                        <h3 style={{ fontSize: "1.2rem", marginTop: "1.5rem", marginBottom: "0.5rem" }}>Exceptions:</h3>
                        <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                            <li>No refunds will be issued for used, washed, or altered products.</li>
                            <li>Digital products, gift cards, and final sale items are non-refundable.</li>
                            <li>Shipping fees are non-refundable unless the refund is due to an error on our part.</li>
                        </ul>

                        <h3 style={{ fontSize: "1.2rem", marginTop: "1.5rem", marginBottom: "0.5rem" }}>Exchange Policy:</h3>
                        <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                            <li>If you receive a defective or incorrect item, we offer free replacements.</li>
                            <li>Exchanges must be requested within **7 days** of receiving the order.</li>
                        </ul>

                        <h3 style={{ fontSize: "1.2rem", marginTop: "1.5rem", marginBottom: "0.5rem" }}>Contact Us:</h3>
                        <p>If you have any questions regarding our refund policy, please contact us at:</p>
                        <p><strong>Email:</strong> support@virtuostore.in</p>
                        <p><strong>Website:</strong> www.virtuostore.in</p>
                    </section>
                )}

                {activeTab === "privacy" && (
                    <section>
                        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Virtuo Store</h1>
                        <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Privacy Policy</h2>
                        <p style={{ marginBottom: "1rem" }}>At **Virtuo Store**, we value your privacy and are committed to protecting your personal data. This policy outlines how we collect, use, and protect your information.</p>

                        <h3 style={{ fontSize: "1.2rem", marginTop: "1.5rem", marginBottom: "0.5rem" }}>Information We Collect:</h3>
                        <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                            <li>Personal details (name, email, contact number) when you place an order or contact us.</li>
                            <li>Payment details (processed securely via third-party payment gateways).</li>
                            <li>Website usage data (collected via cookies for analytics purposes).</li>
                        </ul>

                        <h3 style={{ fontSize: "1.2rem", marginTop: "1.5rem", marginBottom: "0.5rem" }}>How We Use Your Information:</h3>
                        <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                            <li>To process your orders and payments.</li>
                            <li>To communicate with you regarding your purchases and customer support.</li>
                            <li>To improve our website, services, and marketing efforts.</li>
                        </ul>

                        <h3 style={{ fontSize: "1.2rem", marginTop: "1.5rem", marginBottom: "0.5rem" }}>Data Security:</h3>
                        <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                            <li>We implement industry-standard security measures to protect your data.</li>
                            <li>We do not sell or share your personal information with third parties, except when required by law.</li>
                        </ul>

                        <h3 style={{ fontSize: "1.2rem", marginTop: "1.5rem", marginBottom: "0.5rem" }}>Cookies & Tracking:</h3>
                        <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                            <li>We use cookies to enhance user experience and track website performance.</li>
                            <li>You can disable cookies in your browser settings.</li>
                        </ul>

                        <h3 style={{ fontSize: "1.2rem", marginTop: "1.5rem", marginBottom: "0.5rem" }}>Third-Party Services:</h3>
                        <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                            <li>We may use third-party tools such as payment gateways and analytics services, which have their own privacy policies.</li>
                            <li>We are not responsible for third-party data handling practices.</li>
                        </ul>

                        <h3 style={{ fontSize: "1.2rem", marginTop: "1.5rem", marginBottom: "0.5rem" }}>Children's Privacy:</h3>
                        <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                            <li>Our services are not intended for children under the age of 13.</li>
                            <li>We do not knowingly collect personal information from children.</li>
                        </ul>

                        <h3 style={{ fontSize: "1.2rem", marginTop: "1.5rem", marginBottom: "0.5rem" }}>Changes to Privacy Policy:</h3>
                        <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                            <li>We reserve the right to update this policy at any time.</li>
                            <li>Changes will be posted on this page, and continued use of our services implies acceptance.</li>
                        </ul>

                        <h3 style={{ fontSize: "1.2rem", marginTop: "1.5rem", marginBottom: "0.5rem" }}>Contact Us:</h3>
                        <p>If you have any privacy-related concerns, please contact us at:</p>
                        <p><strong>Email:</strong> support@virtuostore.in</p>
                        <p><strong>Website:</strong> www.virtuostore.in</p>
                    </section>
                )}

                {activeTab === "shipping" && (
                    <section>
                        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Virtuo Store</h1>
                        <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Shipping Policy</h2>
                        <p style={{ marginBottom: "1rem" }}>Thank you for shopping with **Virtuo Store**. We are committed to delivering your orders in a timely and secure manner. Please review our shipping policy below.</p>

                        <h3 style={{ fontSize: "1.2rem", marginTop: "1.5rem", marginBottom: "0.5rem" }}>Delivery Timeline:</h3>
                        <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                            <li>Orders are processed within **24-48 hours** of confirmation.</li>
                            <li>Standard delivery across India takes **5-10 business days** from the date of dispatch.</li>
                            <li>Express shipping (if available) takes **2-5 business days**.</li>
                            <li>Unforeseen delays due to weather, holidays, or courier issues will be communicated to you.</li>
                        </ul>

                        <h3 style={{ fontSize: "1.2rem", marginTop: "1.5rem", marginBottom: "0.5rem" }}>Shipping Charges:</h3>
                        <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                            <li>Free shipping on orders above ₹999.</li>
                            <li>A standard shipping fee of ₹50 applies to orders below ₹999.</li>
                            <li>Additional charges may apply for express shipping, which will be displayed at checkout.</li>
                        </ul>

                        <h3 style={{ fontSize: "1.2rem", marginTop: "1.5rem", marginBottom: "0.5rem" }}>Delivery Partners:</h3>
                        <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                            <li>We ship orders via leading courier services such as Bluedart, DTDC, and Delhivery.</li>
                            <li>Tracking details will be provided once the order is shipped.</li>
                        </ul>

                        <h3 style={{ fontSize: "1.2rem", marginTop: "1.5rem", marginBottom: "0.5rem" }}>Order Processing:</h3>
                        <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                            <li>Once your order is confirmed, you will receive a confirmation email.</li>
                            <li>After dispatch, you will receive an email with tracking details.</li>
                        </ul>

                        <h3 style={{ fontSize: "1.2rem", marginTop: "1.5rem", marginBottom: "0.5rem" }}>Order Modifications & Cancellations:</h3>
                        <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                            <li>Orders can be modified or canceled within **12 hours** of placement.</li>
                            <li>Once an order is shipped, cancellations are not allowed.</li>
                        </ul>

                        <h3 style={{ fontSize: "1.2rem", marginTop: "1.5rem", marginBottom: "0.5rem" }}>Lost or Damaged Shipments:</h3>
                        <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                            <li>If your order is lost or damaged during transit, please contact us at **support@virtuostore.in** within 48 hours of delivery.</li>
                            <li>We will initiate an investigation and provide a resolution.</li>
                        </ul>

                        <h3 style={{ fontSize: "1.2rem", marginTop: "1.5rem", marginBottom: "0.5rem" }}>International Shipping:</h3>
                        <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                            <li>Currently, we only ship within India.</li>
                        </ul>

                        <h3 style={{ fontSize: "1.2rem", marginTop: "1.5rem", marginBottom: "0.5rem" }}>Contact Us:</h3>
                        <p>If you have any questions regarding our shipping policy, please contact us at:</p>
                        <p><strong>Email:</strong> support@virtuostore.in</p>
                        <p><strong>Website:</strong> www.virtuostore.in</p>
                    </section>
                )}
            </div>

            <footer style={{ marginTop: "3rem", textAlign: "center", fontSize: "0.9rem", color: "#666" }}>
                Virtuo Store © 2025 | All rights reserved.
            </footer>
        </div>
    );
};

export default Policies;
