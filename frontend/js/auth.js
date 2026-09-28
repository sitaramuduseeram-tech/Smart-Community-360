// =====================================================
// SMART COMMUNITY 360°
// AUTHENTICATION GUARD
// =====================================================

const API_BASE_URL = "https://smart-community-360-1.onrender.com";

// =====================================================
// CHECK USER AUTHENTICATION
// =====================================================

async function checkAuthentication() {

    // Get JWT token from browser storage
    const token = localStorage.getItem("smartCommunityToken");

    // -------------------------------------------------
    // No token = user is not logged in
    // -------------------------------------------------

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {

        // -------------------------------------------------
        // Verify token with backend
        // -------------------------------------------------

        const response = await fetch(
            `${API_BASE_URL}/api/auth/me`,
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const data = await response.json();

        // -------------------------------------------------
        // Token invalid or expired
        // -------------------------------------------------

        if (!response.ok || !data.success) {

            console.log("Authentication failed");

            localStorage.removeItem("smartCommunityToken");
            localStorage.removeItem("smartCommunityUser");

            window.location.href = "login.html";

            return;
        }

        // -------------------------------------------------
        // Authentication successful
        // -------------------------------------------------

        console.log(
            "Authentication verified:",
            data.user
        );

        // Save latest user information
        localStorage.setItem(
            "smartCommunityUser",
            JSON.stringify(data.user)
        );

        const userName = document.getElementById("userName");
        const userEmail = document.getElementById("userEmail");
        const userCity = document.getElementById("userCity");
        const userPoints = document.getElementById("userPoints");

        if (userName) {
            userName.textContent = data.user.name;
        }

        if (userEmail) {
            userEmail.textContent = data.user.email;
        }

        if (userCity) {
            userCity.textContent = data.user.city || "Not specified";
        }

        if (userPoints) {
            userPoints.textContent = data.user.points ?? 0;
        }

    } catch (error) {

        console.error(
            "Authentication request failed:",
            error
        );
    }
}


// =====================================================
// START AUTHENTICATION CHECK
// =====================================================

checkAuthentication();