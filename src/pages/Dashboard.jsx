import { useKanban } from '../context/KanbanContext';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { CheckCircle, Clock, ListTodo, AlertCircle, Hash } from 'lucide-react';

const getToday = () => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${today.getFullYear()}-${month}-${day}`;
};

const getCurrentTime = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

const getScheduleValue = (date, time) => `${date}T${time || '00:00'}`;

export default function Dashboard() {
  const { tasks } = useKanban();

  const totalTasks = tasks.length;
  const todoCount = tasks.filter(t => t.status === 'TO DO').length;
  const doingCount = tasks.filter(t => t.status === 'DOING').length;
  const doneCount = tasks.filter(t => t.status === 'DONE').length;
  
  const overdueCount = tasks.filter(t => {
    if (t.status === 'DONE' || !t.dueDate) return false;
    return t.dueDate < getToday() ||
      (t.dueDate === getToday() && t.dueTime && t.dueTime < getCurrentTime());
  }).length;

  const statusData = [
    { name: 'TO DO', value: todoCount, color: '#94a3b8' },
    { name: 'DOING', value: doingCount, color: '#3b82f6' },
    { name: 'DONE', value: doneCount, color: '#22c55e' }
  ].filter(item => item.value > 0);

  let early = 0, onTime = 0, late = 0;
  tasks.filter(t => t.status === 'DONE' && t.dueDate && t.completeDate).forEach(t => {
    const hasTimes = t.dueTime && t.completeTime;
    const due = hasTimes ? getScheduleValue(t.dueDate, t.dueTime) : t.dueDate;
    const completed = hasTimes
      ? getScheduleValue(t.completeDate, t.completeTime)
      : t.completeDate;
    if (completed < due) early++;
    else if (completed > due) late++;
    else onTime++;
  });

  const performanceData = [
    { name: 'Early', count: early, fill: '#8b5cf6' },
    { name: 'On Time', count: onTime, fill: '#14b8a6' },
    { name: 'Late', count: late, fill: '#f43f5e' }
  ];

  const StatCard = ({ title, value, icon: Icon, bgColor }) => (
    <div className="stat-card">
      <div className="stat-icon" style={{ backgroundColor: bgColor }}>
        <Icon size={24} />
      </div>
      <div className="stat-content">
        <h3>{title}</h3>
        <p>{value}</p>
      </div>
    </div>
  );

  return (
    <div style={{ paddingBottom: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2>Dashboard</h2>
        <p style={{ color: 'var(--text-muted)' }}>Overview of your project progress.</p>
      </div>
      
      <div className="dashboard-grid">
        <StatCard title="Total Tasks" value={totalTasks} icon={Hash} bgColor="#6366f1" />
        <StatCard title="TO DO" value={todoCount} icon={ListTodo} bgColor="#94a3b8" />
        <StatCard title="DOING" value={doingCount} icon={Clock} bgColor="#3b82f6" />
        <StatCard title="DONE" value={doneCount} icon={CheckCircle} bgColor="#22c55e" />
        <StatCard title="Overdue" value={overdueCount} icon={AlertCircle} bgColor="#ef4444" />
      </div>

      <div className="charts-grid">
        <div className="chart-panel">
          <h3>Task Status Distribution</h3>
          <div style={{ height: '300px' }}>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
                    {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '4rem' }}>No data available</p>}
          </div>
        </div>

        <div className="chart-panel">
          <h3>Completion Performance</h3>
          <div style={{ height: '300px' }}>
            {performanceData.some(d => d.count > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={60}>
                    {performanceData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '4rem' }}>Complete a task with a due date to see performance metrics.</p>}
          </div>
        </div>
      </div>

    </div>
  );
}
