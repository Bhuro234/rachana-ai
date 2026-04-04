/* ========================================
   Rachana AI — Advanced 3D Scroll Engine
   Production-Level Animations
   ======================================== */

document.addEventListener("DOMContentLoaded", () => {

    // ═══════ DEVICE DETECTION ═══════
    const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches;

    // ═══════ INTRO ANIMATION ═══════
    const overlay = document.getElementById("intro-overlay");
    const navbar = document.getElementById("navbar");

    setTimeout(() => overlay.classList.add("shrink"), 2600);

    setTimeout(() => {
        overlay.classList.add("fade-out");
        navbar.classList.remove("hidden");
        navbar.classList.add("visible");
    }, 3700);

    setTimeout(() => { overlay.style.display = "none"; }, 4400);

    // ═══════ 3D SCROLL REVEAL ENGINE ═══════
    const hiddenSections = document.querySelectorAll(".hidden-section");

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.08, rootMargin: "0px 0px -60px 0px" }
    );

    hiddenSections.forEach((s) => revealObserver.observe(s));

    // ═══════ ADVANCED 3D TILT ON FEATURE CARDS (desktop only) ═══════
    if (!isTouchDevice) {
    const featureCards = document.querySelectorAll(".feature-card[data-tilt]");

    featureCards.forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            const tiltX = (y - 0.5) * -16;
            const tiltY = (x - 0.5) * 16;
            const shine = x * 100;

            card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(20px) translateY(-6px) scale(1.02)`;
            card.style.background = `linear-gradient(${105 + tiltY * 3}deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.35) ${shine}%, rgba(255,255,255,0.45) 100%)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
            card.style.background = "";
        });
    });
    } // end !isTouchDevice guard for card tilt

    // ═══════ PARALLAX SCROLL ENGINE ═══════
    const cubes = document.querySelectorAll(".floating-cube");
    const heroContent = document.querySelector(".hero-content");
    const sections = document.querySelectorAll(".section");

    let ticking = false;
    let lastScrollY = 0;

    function onScroll() {
        lastScrollY = window.scrollY;
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    function updateParallax() {
        const scrollY = lastScrollY;

        // Floating cubes 3D parallax
        cubes.forEach((cube, i) => {
            const speed = 0.08 + i * 0.05;
            const rotSpeed = 0.015 + i * 0.01;
            cube.style.transform = `
                translateY(${scrollY * speed * -1}px)
                translateZ(${Math.sin(scrollY * 0.003 + i) * 30}px)
                rotateX(${scrollY * rotSpeed}deg)
                rotateY(${scrollY * rotSpeed * 1.3}deg)
            `;
        });

        // Hero content depth — pushes back on scroll
        if (heroContent) {
            const heroProgress = Math.min(scrollY / 600, 1);
            heroContent.style.transform = `
                translateY(${scrollY * 0.15}px)
                translateZ(${heroProgress * -80}px)
                scale(${1 - heroProgress * 0.08})
            `;
            heroContent.style.opacity = 1 - heroProgress * 0.7;
        }

        // Per-section 3D depth effect
        sections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            const viewH = window.innerHeight;
            const progress = (viewH - rect.top) / (viewH + rect.height);
            const clamped = Math.max(0, Math.min(1, progress));

            // Subtle rotation based on scroll position
            const rotX = (0.5 - clamped) * 4;
            section.style.perspectiveOrigin = `50% ${40 + clamped * 20}%`;
        });

        ticking = false;
    }

    window.addEventListener("scroll", onScroll, { passive: true });

    // ═══════ GLASS PANEL TILT (Generator — desktop only) ═══════
    if (!isTouchDevice) {
    const glassPanels = document.querySelectorAll(".glass-panel");

    glassPanels.forEach((panel) => {
        panel.addEventListener("mousemove", (e) => {
            const rect = panel.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            panel.style.transform = `perspective(1000px) rotateX(${y * -4}deg) rotateY(${x * 4}deg)`;
        });

        panel.addEventListener("mouseleave", () => {
            panel.style.transform = "";
        });
    });
    } // end !isTouchDevice guard for glass tilt

    // ═══════ NAVBAR AUTO-HIDE ═══════
    let prevScroll = 0;

    window.addEventListener("scroll", () => {
        if (overlay.style.display !== "none") return;
        const curr = window.scrollY;
        if (curr > prevScroll && curr > 120) {
            navbar.style.transform = "translateY(-100%)";
            navbar.style.opacity = "0";
        } else {
            navbar.style.transform = "translateY(0)";
            navbar.style.opacity = "1";
        }
        prevScroll = curr;
    }, { passive: true });

    // ═══════ GENERATOR ═══════
    const generateBtn = document.getElementById("generate-btn");
    const btnText = document.getElementById("btn-text");
    const btnLoader = document.getElementById("btn-loader");
    const promptInput = document.getElementById("prompt-input");
    const errorMsg = document.getElementById("error-msg");
    const resultImage = document.getElementById("result-image");
    const downloadBtn = document.getElementById("download-btn");
    const placeholderArt = document.getElementById("placeholder-art");

    generateBtn.addEventListener("click", async () => {
        const prompt = promptInput.value.trim();
        if (!prompt) { showError("⚠️ Please enter a building or house description."); return; }

        hideError();
        btnText.textContent = "Generating…";
        btnLoader.classList.remove("hidden");
        generateBtn.disabled = true;
        generateBtn.style.opacity = "0.7";
        resultImage.classList.add("hidden");
        downloadBtn.classList.add("hidden");
        placeholderArt.innerHTML = '<div class="placeholder-icon shimmer" style="width:100%;height:300px;border-radius:20px;"></div><p style="margin-top:16px">AI is creating your vision…</p>';

        try {
            const response = await fetch("/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || `Server error ${response.status}`);

            const imgSrc = `data:image/png;base64,${data.image}`;
            resultImage.src = imgSrc;
            resultImage.classList.remove("hidden");
            downloadBtn.href = imgSrc;
            downloadBtn.classList.remove("hidden");
            placeholderArt.style.display = "none";
        } catch (err) {
            showError(`❌ ${err.message}`);
            placeholderArt.innerHTML = '<div class="placeholder-icon">🏠</div><p>Your generated image will appear here</p>';
        } finally {
            btnText.textContent = "Get Reference";
            btnLoader.classList.add("hidden");
            generateBtn.disabled = false;
            generateBtn.style.opacity = "1";
        }
    });

    promptInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) generateBtn.click();
    });

    function showError(msg) { errorMsg.textContent = msg; errorMsg.classList.remove("hidden"); }
    function hideError() { errorMsg.classList.add("hidden"); }

    // ═══════ SMOOTH NAV LINKS ═══════
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute("href"));
            if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    // ═══════ GALLERY → PROMPT ═══════
    document.querySelectorAll(".gallery-card").forEach((card) => {
        card.addEventListener("click", () => {
            const desc = card.querySelector("p")?.textContent;
            if (desc) {
                promptInput.value = `A stunning ${desc.toLowerCase()} with beautiful architectural details, natural lighting, landscaped surroundings`;
                document.getElementById("generator").scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    // ═══════ MOUSE-FOLLOW GLOW (CYBERPUNK — desktop only) ═══════
    if (!isTouchDevice) {
        const glowEl = document.createElement("div");
        glowEl.style.cssText = `
            position: fixed; width: 300px; height: 300px; border-radius: 50%;
            background: radial-gradient(circle, rgba(179,136,255,0.06) 0%, transparent 70%);
            pointer-events: none; z-index: 0; transform: translate(-50%, -50%);
            transition: left 0.3s ease, top 0.3s ease;
        `;
        document.body.appendChild(glowEl);

        document.addEventListener("mousemove", (e) => {
            glowEl.style.left = e.clientX + "px";
            glowEl.style.top = e.clientY + "px";
        });
    }
});
