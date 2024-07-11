

// controllers/superadmin.js
import Employee from '../models/employee.js';
import Month from '../models/calander.js';

function formatDuration(hours) {
    const h = Math.floor(hours);
    const min = Math.floor((hours - h) * 60);
    const sec = Math.floor(((hours - h) * 60 - min) * 60);
    return `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

export async function getEmployeeData(req, res) {
    try {
        const { month } = req.query;
        console.log('Requested month:', month);

        // Find all employees and populate their timeRecords for the given month
        const employees = await Employee.find().populate({
            path: 'timeRecords',
            match: { 'date': { $gte: new Date(`${month}-01`), $lte: new Date(`${month}-31`) } }
        });

        console.log('Employees found:', employees);

        // Find month data for the specified month
        const monthData = await Month.findOne({ month });
        console.log('Month data:', monthData);

        // Prepare employee data with calculated fields
        const employeeData = employees.map(employee => {
            let totalWorkedHours = 0;

            // Calculate total worked hours for the employee in the specified month
            employee.timeRecords.forEach(record => {
                totalWorkedHours += parseFloat(record.duration);
            });

            // Calculate total working hours based on monthData (adjust calculation as needed)
            const totalWorkingHours = monthData ? monthData.workingDays * 7 : 0; // Adjust multiplier as per your requirement

            // Format workedHours and remainingHours
            const workedHours = formatDuration(totalWorkedHours);
            const remainingHours = formatDuration(totalWorkingHours - totalWorkedHours);

            return {
                fullname: employee.fullname,
                totalWorkingHours, // Ensure this reflects the correct calculation
                workedHours,
                remainingHours
            };
        });

        console.log('Employee data:', employeeData);
        res.status(200).json(employeeData);
    } catch (error) {
        console.error('Error fetching employee data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}




// Function to get available months
export async function getAvailableMonths(req, res) {
    try {
        const months = await Month.find().select('month'); // Assuming 'month' is the field in your Month model
        res.status(200).json(months);
    } catch (error) {
        console.error('Error fetching available months:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
