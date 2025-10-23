document.addEventListener("DOMContentLoaded", function() {
    const welcomeMessage = document.getElementById("welcomeMessage");
    const recentActivityContent = document.getElementById("recentActivityContent");

    // This function would ideally be called with a user token from a login session.
    // For now, we'll simulate fetching data.
    function fetchDashboardData() {
        // In a real application, you would send a request to your back-end API here.
        // The request would include the user's authentication token.
        // Example:
        // fetch('http://localhost:3000/api/dashboard', {
        //     headers: {
        //         'Authorization': `Bearer ${userToken}`
        //     }
        // })
        // .then(response => response.json())
        // .then(data => {
        //     // Update the welcome message with the user's name
        //     welcomeMessage.textContent = `Welcome, ${data.userName}!`;
        //
        //     // Display recent activity from the fetched data
        //     recentActivityContent.innerHTML = '';
        //     if (data.recentActivity && data.recentActivity.length > 0) {
        //         data.recentActivity.forEach(activity => {
        //             const p = document.createElement('p');
        //             p.textContent = activity.description;
        //             recentActivityContent.appendChild(p);
        //         });
        //     } else {
        //         recentActivityContent.innerHTML = '<p>No recent activity found.</p>';
        //     }
        // })
        // .catch(error => {
        //     console.error('Error fetching dashboard data:', error);
        //     // Redirect to login page if authentication fails
        //     window.location.href = 'login.html';
        // });

        // --- DEMO VERSION (for now, without a real back-end) ---
        // Simulate a successful API response
        const mockData = {
            userName: "John Doe",
            recentActivity: [
                { id: 1, description: "Ordered Paracetamol on Oct 10, 2025" },
                { id: 2, description: "Consultation booked with Dr. Smith for Oct 12, 2025" },
                { id: 3, description: "Uploaded a lab report on Oct 08, 2025" }
            ]
        };
        
        welcomeMessage.textContent = `Welcome, ${mockData.userName}!`;
        recentActivityContent.innerHTML = '';
        mockData.recentActivity.forEach(activity => {
            const p = document.createElement('p');
            p.textContent = activity.description;
            recentActivityContent.appendChild(p);
        });
    }

    // Call the function to load dashboard data
    fetchDashboardData();
});