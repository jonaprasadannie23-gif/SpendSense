import axios from "axios";
import "./App.css";
import { useState, useEffect } from "react";
import AuthForm from "./components/AuthForm";
import ChangePasswordModal from "./components/ChangePasswordModal";
import {
  FaHome,
  FaWallet,
  FaChartPie,
  FaCog,
  FaSignOutAlt,
  FaMoneyBillWave
} from "react-icons/fa";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

function App() {

  const [expenses, setExpenses] =
    useState([]);

  const [title, setTitle] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [date, setDate] =
    useState("");

  const [currentIncome, setCurrentIncome] =
  useState(0);

const [newIncome, setNewIncome] =
  useState("");
  

const [showIncomeInput, setShowIncomeInput] =
  useState(false);
const [darkMode, setDarkMode] =
  useState(true);

 
  const [currentUserId, setCurrentUserId] =
    useState(null);

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [editAmount, setEditAmount] =
    useState("");

  const [editingExpense, setEditingExpense] =
    useState(null);

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

    const [showPasswordPopup, setShowPasswordPopup] =
  useState(false);
const [showLogoutPopup, setShowLogoutPopup] =
  useState(false);
 

  const [activePage, setActivePage] =
    useState("Dashboard");
    const [selectedMonth, setSelectedMonth] =

  useState(

    new Date()

      .toISOString()

      .slice(0, 7)
  );

  const COLORS = [
    "#8b5cf6",
    "#06b6d4",
    "#ec4899",
    "#f97316",
    "#22c55e",
    "#eab308",
    "#ef4444",
  ];

  useEffect(() => {

    if (currentUserId) {

      fetchExpenses();
    }

  },
  
  [currentUserId]);
  useEffect(() => {

  setNewIncome(
    currentIncome
  );

}, [currentIncome]);

  const fetchExpenses = async () => {

    if (!currentUserId) {
      return;
    }

    try {

      const response =
        await axios.get(
          `https://spendsense-1fam.onrender.com/expenses?user_id=${currentUserId}`
        );

      setExpenses(
        response.data
      );

    }

    catch (error) {

      console.log(error);

    }
  };

  const handleLoginSuccess = (userId, income) => {
    setCurrentIncome(income);
    setCurrentUserId(userId);
    setIsLoggedIn(true);
  };

  const addExpense = async () => {

    if (
      title === "" ||
      amount === "" ||
      category === "" ||
      date === ""
    ) {

      alert(
        "Please fill all fields"
      );

      return;
    }

    const selectedMonth =
      date.slice(0, 7);

    const currentMonthCheck =

      new Date()

        .toISOString()

        .slice(0, 7);

    if (
      selectedMonth >
      currentMonthCheck
    ) {

      alert(
        "Cannot add future month expenses"
      );

      return;
    }

    const newExpense = {

      title,
      amount,
      category,
      date,
      user_id: currentUserId,
    };

    try {

      await axios.post(
        "https://spendsense-1fam.onrender.com/add-expense",
        newExpense
      );

      fetchExpenses();

      setTitle("");
      setAmount("");
      setCategory("");
      setDate("");

    }

    catch (error) {

      console.log(error);

    }
  };

  const editExpense = (
    expense
  ) => {

    setEditingExpense(expense);

    setEditAmount(expense.amount);
  };

  const saveUpdatedExpense =
    async () => {

      try {

        await axios.put(

          `https://spendsense-1fam.onrender.com/update-expense/${editingExpense.id}`,

          {
            title:
              editingExpense.title,

            amount:
              editAmount,

            category:
              editingExpense.category,
          }
        );

        fetchExpenses();

        setEditingExpense(null);

      }

      catch (error) {

        console.log(error);

      }
    };

  const deleteExpense = async (
    id
  ) => {

    try {

      await axios.delete(
        `https://spendsense-1fam.onrender.com/delete-expense/${id}`
      );

      fetchExpenses();

    }

    catch (error) {

      console.log(error);

    }
  };
const updateIncome = async () => {

  if (
    !newIncome ||
    Number(newIncome) <= 0
  ) {

    alert(
      "Please enter a valid income"
    );

    return;
  }

  try {

    await axios.put(

      `https://spendsense-1fam.onrender.com/update-income/${currentUserId}`,

      {
        income: Number(
          newIncome
        )
      }
    );

    setCurrentIncome(
      Number(newIncome)
    );

    alert(
      "Income updated successfully"
    );

  }
  

  catch (error) {

    console.log(error);

    alert(
      "Failed to update income"
    );

  }
};
const exportReport = () => {

  let csvContent =

`SPENDSENSE MONTHLY REPORT
Month,${selectedMonth}
Income,${currentIncome}
Balance,${balance}
This Month Spending,${monthlyExpenses}

Title,Amount,Category,Date
`;

  selectedMonthExpenses.forEach(

    (expense) => {

      csvContent +=
`${expense.title},${expense.amount},${expense.category},${expense.date}\n`;

    }
  );

  const blob = new Blob(

    [csvContent],

    {
      type: "text/csv;charset=utf-8;"
    }
  );

  const link =
    document.createElement("a");

  const url =
    URL.createObjectURL(blob);

  link.href = url;

  link.download =
`${selectedMonth}_Report.csv`;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

};
  const currentMonth =

    new Date()

      .toISOString()

      .slice(0, 7);

  const totalExpenses =
    expenses.reduce(
      (total, expense) =>
        total +
        Number(expense.amount),
      0
    );

  const monthlyExpenses =

    expenses

      .filter(

        (expense) =>

          expense.date.startsWith(
  currentMonth
)
      )

      .reduce(

        (total, expense) =>

          total +
          Number(expense.amount),

        0
      );

  const monthlyData = {};

  expenses.forEach((expense) => {

    const month =
      expense.date.slice(0, 7);

    if (!monthlyData[month]) {

      monthlyData[month] = 0;
    }

    monthlyData[month] +=
      Number(expense.amount);

  });
  const selectedMonthExpenses =

  expenses.filter(

    (expense) =>

      expense.date.startsWith(
        selectedMonth
      )
  );

 const balance =
  currentIncome - monthlyExpenses;
  const largestExpense =

  selectedMonthExpenses.length > 0

    ? selectedMonthExpenses.reduce(

        (max, expense) =>

          expense.amount > max.amount

            ? expense

            : max

      )

    : null;
    console.log(
  "Largest Expense:",
  largestExpense
);
    

  const chartData = [

    {
      name: "Food",

      value: expenses

        .filter(
  (e) =>

    e.category ===
    "Food"

    &&

    e.date.startsWith(
      selectedMonth
    )
)

        .reduce(
          (total, e) =>
            total +
            Number(e.amount),
          0
        ),
    },

    {
      name: "Transport",

      value: expenses

        .filter(
  (e) =>

    e.category ===
    "Transport"

    &&

    e.date.startsWith(
      selectedMonth
    )
)

        .reduce(
          (total, e) =>
            total +
            Number(e.amount),
          0
        ),
    },

    {
      name: "Shopping",

      value: expenses

        .filter(
  (e) =>

    e.category ===
    "Shopping"

    &&

    e.date.startsWith(
      selectedMonth
    )
)
        .reduce(
          (total, e) =>
            total +
            Number(e.amount),
          0
        ),
    },

    {
      name: "Bills",

      value: expenses

        .filter(
  (e) =>

    e.category ===
    "Bills"

    &&

    e.date.startsWith(
      selectedMonth
    )
)

        .reduce(
          (total, e) =>
            total +
            Number(e.amount),
          0
        ),
    },

    {
      name: "Health",

      value: expenses

        .filter(
  (e) =>

    e.category ===
    "Health"

    &&

    e.date.startsWith(
      selectedMonth
    )
)

        .reduce(
          (total, e) =>
            total +
            Number(e.amount),
          0
        ),
    },

    {
      name: "Entertainment",

      value: expenses

        .filter(
  (e) =>

    e.category ===
    "Entertainment"

    &&

    e.date.startsWith(
      selectedMonth
    )
)

        .reduce(
          (total, e) =>
            total +
            Number(e.amount),
          0
        ),
    },

    {
      name: "Grocery",

      value: expenses

        .filter(
  (e) =>

    e.category ===
    "Grocery"

    &&

    e.date.startsWith(
      selectedMonth
    )
)

        .reduce(
          (total, e) =>
            total +
            Number(e.amount),
          0
        ),
    },
  ];

  const filteredChartData =
    chartData.filter(
      (item) =>
        item.value > 0
    );
    const hasAnalyticsData =

  filteredChartData.length > 0;
  if (!isLoggedIn) {
    return <AuthForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (

    <div
  className={
    darkMode
      ? "app-layout dark"
      : "app-layout light"
  }
>

      <div className="sidebar">

  <div className="logo">

    

    <h1>
      Welcome Back
    </h1>

  </div>
  <div className="menu-items">

  

  <button

  className={
    activePage ===
    "Dashboard"

      ? "active-sidebar"

      : ""
  }

  onClick={() =>
    setActivePage(
      "Dashboard"
    )
  }
>
          <>
  <FaHome />
  <span>
    Dashboard
  </span>
</>
        </button>

        <button

  className={
    activePage ===
    "Expenses"

      ? "active-sidebar"

      : ""
  }

  onClick={() =>
    setActivePage(
      "Expenses"
    )
  }
>
  <FaWallet />
<span>Expenses</span>
</button>

       <button

  className={
    activePage ===
    "Analytics"

      ? "active-sidebar"

      : ""
  }

  onClick={() =>
    setActivePage(
      "Analytics"
    )
  }
>
 <FaChartPie />
<span>Analytics</span>
</button>

        <button

  className={
    activePage ===
    "Settings"

      ? "active-sidebar"

      : ""
  }

  onClick={() =>
    setActivePage(
      "Settings"
    )
  }
>
 <FaCog />
<span>Settings</span>
</button>

</div>

<button
  onClick={() =>
    setShowLogoutPopup(true)
  }
>
  <FaSignOutAlt />
  <span>Logout</span>
</button>

{showLogoutPopup && (

  <div className="modal-overlay">

    <div className="modal">

      <h3>
        Confirm Logout
      </h3>

      <p>
        Are you sure you want to logout?
      </p>

      <button
        onClick={() =>
          setShowLogoutPopup(false)
        }
      >
        Cancel
      </button>

      <button
        onClick={() => {

          setIsLoggedIn(false);

          setCurrentUserId(null);

          setExpenses([]);

          setShowLogoutPopup(false);

        }}
      >
        Logout
      </button>

    </div>

  </div>

)}

      </div>

      <div className="container">

        {

          activePage ===
          "Dashboard"

          &&

          (

          <>

<div className="logo">

  <FaMoneyBillWave />

  <h1>
    SpendSense

  </h1>

</div>
<p className="subtitle">
  Track smarter. Spend better.
</p>

  <div className="card-container">

    <div className="card">

      <h3>
         Balance
      </h3>

      <p>
        ₹{balance}
      </p>

    </div>

    <div className="card">

      <h3>
        Income
      </h3>

      <p>
        ₹{currentIncome}
      </p>

    </div>

    <div className="card">

      <h3>
        This Month Spending
      </h3>

      <p>
        ₹{monthlyExpenses}
      </p>

    </div>
    {largestExpense && (

  <div className="largest-expense-card">

    <h3>
       Top Expense This Month
    </h3>

    <h2>
      ₹{largestExpense.amount}
    </h2>

    <p>
      {largestExpense.title}
    </p>

    <small>
      {largestExpense.category}
    </small>

  </div>

)}

  </div>

</>

          )
        }

        {

          activePage ===
          "Expenses"

          &&

          (

            <>

              <div className="form-container">

                <h2>
                  Add Expense
                </h2>

                <input
                  type="text"

                  placeholder="Expense Title"

                  value={title}

                  onChange={(e) =>
                    setTitle(
                      e.target.value
                    )
                  }
                />

                <input
                  type="number"

                  placeholder="Amount"

                  value={amount}

                  onChange={(e) =>
                    setAmount(
                      e.target.value
                    )
                  }
                />

                <input
                  type="date"

                  value={date}

                  onChange={(e) =>
                    setDate(
                      e.target.value
                    )
                  }
                />

                <select
                  value={category}

                  onChange={(e) =>
                    setCategory(
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    Select Category
                  </option>

                  <option>
                    Food
                  </option>

                  <option>
                    Transport
                  </option>

                  <option>
                    Shopping
                  </option>

                  <option>
                    Bills
                  </option>

                  <option>
                    Health
                  </option>

                  <option>
                    Entertainment
                  </option>

                  <option>
                    Grocery
                  </option>

                </select>

                <button
                  onClick={addExpense}
                >
                  Add Expense
                </button>

              </div>

              <div className="filter-container">

                {[
                  "All",
                  "Food",
                  "Transport",
                  "Shopping",
                  "Bills",
                  "Health",
                  "Entertainment",
                  "Grocery",
                ].map((item) => (

                  <button
                    key={item}

                    className={
                      selectedCategory === item
                        ? "active-filter"
                        : ""
                    }

                    onClick={() =>
                      setSelectedCategory(item)
                    }
                  >
                    {item}
                  </button>

                ))}

              </div>
                {
  editingExpense && (

    <div className="form-container">

      <h2>
        Edit Expense
      </h2>

      <input
        type="number"

        value={editAmount}

        onChange={(e) =>
          setEditAmount(
            e.target.value
          )
        }
      />

      <button
        onClick={
          saveUpdatedExpense
        }
      >
        Save Changes
      </button>

    </div>
  )
}
              <div className="expense-list">

                <h2>
                  Recent Expenses
                </h2>

                {expenses

                  .filter((expense) =>

                    selectedCategory ===
                    "All"

                      ? true

                      : expense.category ===
                        selectedCategory
                  )

                  .map((expense) => (

                    <div
                      className="expense-item"
                      key={expense.id}
                    >

                      <div>

                        <strong>
                          {expense.title}
                        </strong>

                        <p>
                          {expense.category}
                        </p>

                        <p>
                          {expense.date}
                        </p>

                      </div>

                      <div className="expense-actions">

                        <span>
                          ₹{expense.amount}
                        </span>

                        <button
                          className="edit-btn"

                          onClick={() =>
                            editExpense(expense)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"

                          onClick={() =>
                            deleteExpense(expense.id)
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </div>
                  ))}

              </div>

            </>

          )
        }

        {

          activePage ===
          "Analytics"

          &&

          (

            <>
              <div className="form-container">

  <h2>
    Select Analytics Month
  </h2>

  <input
    type="month"

    value={selectedMonth}

    onChange={(e) =>

      setSelectedMonth(
        e.target.value
      )
    }
  />

</div>
              <div className="chart-container">

                <h2>
                  Expense Breakdown
                </h2>
                {
  !hasAnalyticsData && (

    <p>
      No expenses found
      for this month
    </p>
  )
}
{
  hasAnalyticsData &&
                <PieChart
                  width={400}
                  height={300}
                >

                  <Pie
                    data={
                      filteredChartData
                    }

                    dataKey="value"

                    nameKey="name"

                    cx="50%"

                    cy="50%"

                    outerRadius={100}

                    label
                  >

                    {filteredChartData.map(
                      (
                        entry,
                        index
                      ) => (

                        <Cell
                          key={index}

                          fill={
                            COLORS[
                              index %
                                COLORS.length
                            ]
                          }
                        />

                      )
                    )}

                  </Pie>

                  <Tooltip />

                  <Legend />

                </PieChart>
}
              </div>

              <div className="chart-container">

                <h2>
                  Monthly History
                </h2>

                {

                  Object.entries(
  monthlyData
)

.filter(

  ([month]) =>

    month ===
    selectedMonth
)

                    .sort()

                    .reverse()

                    .map(

                      ([month, total]) => (

                        <div
                          className="expense-item"

                          key={month}
                        >

                          <strong>
                            {month}
                          </strong>

                          <span>
                            ₹{total}
                          </span>

                        </div>
                      )
                    )
                }

              </div>
              <div className="chart-container">

  <h2>
    Expense Details
  </h2>

  {

    selectedMonthExpenses.length === 0

    ? (

      <p>
        No expenses found
      </p>

    )

    : (

      selectedMonthExpenses.map(

        (expense) => (

          <div
            className="expense-item"
            key={expense.id}
          >

            <div>

              <strong>
                {expense.title}
              </strong>

              <p>
                {expense.category}
              </p>

              <p>
                {expense.date}
              </p>

            </div>

            <span>
              ₹{expense.amount}
            </span>

          </div>
        )
      )
    )
  }

</div>

            </>

          )
        }

        {

          activePage ===
"Settings"

&&

(

  <div className="form-container">

    <h1>
      Settings
    </h1>

  <div className="income-card">

  <h3>
    Monthly Income
  </h3>

  <h2>
    ₹{currentIncome}
  </h2>

  <button
    onClick={() =>
      setShowIncomeInput(true)
    }
  >
    Change Income
  </button>

</div>
{showIncomeInput && (

  <div className="modal-overlay">

    <div className="modal">

      <h3>
        Change Income
      </h3>

      <p>
        Current Income:
        ₹{currentIncome}
      </p>

      <input
        type="number"

        placeholder="Enter new income"

        value={newIncome}

        onChange={(e) =>
          setNewIncome(
            e.target.value
          )
        }
      />

      <button
        onClick={() =>
          setShowIncomeInput(false)
        }
      >
        Cancel
      </button>

      <button
        onClick={async () => {

          await updateIncome();

          setShowIncomeInput(false);

        }}
      >
        Save
      </button>

    </div>

  </div>

)}


    

   <h3>
  Appearance
</h3>

<div className="theme-toggle">

  <span>
    🌙 Dark
  </span>

  <button
    className="toggle-switch"
    onClick={() =>
      setDarkMode(!darkMode)
    }
  >

    <div
      className={
        darkMode
          ? "toggle-knob dark"
          : "toggle-knob light"
      }
    ></div>

  </button>

  <span>
    ☀️ Light
  </span>

</div>

<h3
  style={{
    marginTop: "25px"
  }}
>
  Quick Actions
</h3>

<div className="action-buttons">

  <button
    onClick={exportReport}
  >
    📁 Export Reports
  </button>

  <button
    onClick={() =>
      setShowPasswordPopup(true)
    }
  >
    🔐 Change Password
  </button>

</div>
{showPasswordPopup && (
  <ChangePasswordModal
    userId={currentUserId}
    onClose={() => setShowPasswordPopup(false)}
  />
)}

  </div>

)
        }

      </div>

    </div>
  );
  <div className="section-divider"></div>
}

export default App;