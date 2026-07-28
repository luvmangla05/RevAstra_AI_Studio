import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/AppLayout';
import { Task } from '../../types';
import { CheckSquare, Plus, Phone, Calendar, Clock, Check, AlertTriangle, MessageSquare } from 'lucide-react';

export default function TasksApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'pending' | 'completed'>('pending');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newTask, setNewTask] = useState({
    title: '',
    leadName: '',
    leadPhone: '',
    type: 'whatsapp' as const,
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '12:00',
    priority: 'high' as const,
    notes: ''
  });

  useEffect(() => {
    fetch('/api/crm/tasks')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setTasks(data);
      });
  }, []);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;

    const taskToAdd: Task = {
      id: 't_' + Math.random().toString(36).substring(2, 9),
      title: newTask.title,
      leadName: newTask.leadName,
      leadPhone: newTask.leadPhone,
      type: newTask.type,
      dueDate: newTask.dueDate,
      dueTime: newTask.dueTime,
      priority: newTask.priority,
      status: 'pending',
      notes: newTask.notes,
      createdAt: new Date().toISOString()
    };

    try {
      await fetch('/api/crm/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskToAdd)
      });
    } catch (e) {
      console.warn("Failed to persist task on server", e);
    }

    setTasks([taskToAdd, ...tasks]);
    setIsAddModalOpen(false);
    setNewTask({
      title: '',
      leadName: '',
      leadPhone: '',
      type: 'whatsapp',
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '12:00',
      priority: 'high',
      notes: ''
    });
  };

  const toggleTaskStatus = (id: string) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'completed' ? 'pending' : 'completed';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const filteredTasks = tasks.filter(t => filter === 'completed' ? t.status === 'completed' : t.status !== 'completed');

  return (
    <AppLayout 
      title="Tasks & Follow-up Reminders" 
      subtitle="Ensure zero missed follow-ups with scheduled WhatsApp, call, and site-visit reminders."
    >
      <div className="space-y-6">
        
        {/* Header Controls */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                filter === 'pending' ? 'bg-astra-navy text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Pending Tasks ({tasks.filter(t => t.status !== 'completed').length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                filter === 'completed' ? 'bg-astra-navy text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Completed ({tasks.filter(t => t.status === 'completed').length})
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-astra-navy text-white hover:bg-slate-800 text-xs font-bold rounded-lg transition flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5 mr-1 text-astra-gold" />
            <span>+ Add Task / Reminder</span>
          </button>
        </div>

        {/* Task List */}
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {filteredTasks.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No tasks in this view. Click "+ Add Task / Reminder" to schedule a follow-up.
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div key={task.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-slate-50/80 transition gap-3">
                  
                  <div className="flex items-start space-x-3">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={`w-5 h-5 rounded border flex items-center justify-center mt-0.5 transition ${
                        task.status === 'completed' 
                          ? 'bg-emerald-500 border-emerald-500 text-white' 
                          : 'border-slate-300 hover:border-astra-gold bg-white'
                      }`}
                    >
                      {task.status === 'completed' && <Check className="w-3 h-3" />}
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs font-bold ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {task.title}
                        </span>
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                          task.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {task.priority}
                        </span>
                      </div>

                      {task.leadName && (
                        <p className="text-[11px] text-slate-500">
                          Lead: <strong className="text-slate-700">{task.leadName}</strong> ({task.leadPhone})
                        </p>
                      )}

                      {task.notes && (
                        <p className="text-[11px] text-slate-500 italic">"{task.notes}"</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-[11px] text-slate-500 font-mono text-right">
                      <div className="flex items-center space-x-1 justify-end">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{task.dueDate} @ {task.dueTime}</span>
                      </div>
                    </div>

                    {task.leadPhone && (
                      <a
                        href={`https://wa.me/${task.leadPhone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded transition"
                      >
                        WhatsApp
                      </a>
                    )}
                  </div>

                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 font-display">Schedule New Task / Reminder</h3>
            
            <form onSubmit={handleAddTask} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="e.g. Call Rajesh regarding GST quotation"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-astra-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Lead Name</label>
                  <input
                    type="text"
                    value={newTask.leadName}
                    onChange={(e) => setNewTask({ ...newTask, leadName: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-astra-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newTask.leadPhone}
                    onChange={(e) => setNewTask({ ...newTask, leadPhone: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-astra-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-astra-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-astra-gold"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-astra-navy text-white hover:bg-slate-800 rounded-lg"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </AppLayout>
  );
}
