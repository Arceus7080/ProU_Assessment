const API = 'http://localhost:4000/api';

async function request(url, opts){
  const res = await fetch(url, opts);
  if(!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json();
}

/* Employees */
async function loadEmployees(){
  const emp = await request(`${API}/employees`);
  const list = document.getElementById('empList');
  const sel = document.getElementById('taskEmp');
  list.innerHTML = '';
  sel.innerHTML = '<option value="">Unassigned</option>';
  emp.forEach(e=>{
    const li = document.createElement('li');
    li.innerHTML = `<div>
      <strong>${escapeHtml(e.name)}</strong><br><small>${escapeHtml(e.email||'—')}</small>
    </div>`;
    const actions = document.createElement('div');
    const del = document.createElement('button'); del.textContent='Delete'; del.className='small';
    del.onclick = async ()=>{ await request(`${API}/employees/${e.id}`, {method:'DELETE'}); await loadEmployees(); await loadTasks(); };
    actions.appendChild(del);
    li.appendChild(actions);
    list.appendChild(li);

    const opt = document.createElement('option'); opt.value=e.id; opt.textContent=e.name;
    sel.appendChild(opt);
  });
}

/* Tasks */
// Tasks (updated to allow assigning/unassigning)
async function loadTasks(){
  const [tasks, employees] = await Promise.all([
    request(`${API}/tasks`),
    request(`${API}/employees`)
  ]);

  const ul = document.getElementById('taskList');
  ul.innerHTML='';

  tasks.forEach(t=>{
    const li = document.createElement('li');

    // left column - details
    const left = document.createElement('div');
    left.innerHTML = `
      <strong>${escapeHtml(t.title)}</strong> <small>[${escapeHtml(t.status||'pending')}]</small><br>
      <small>${escapeHtml(t.description||'')}</small><br>
      <small>Assigned to: ${escapeHtml(t.employee_name||'Unassigned')}</small>
    `;

    // right column - actions including assign control
    const right = document.createElement('div');
    right.style.display = 'flex';
    right.style.gap = '8px';
    right.style.alignItems = 'center';

    // Assign select
    const sel = document.createElement('select');
    sel.className = 'assign-select';
    const emptyOpt = document.createElement('option');
    emptyOpt.value = '';
    emptyOpt.textContent = t.employee_name ? `Unassign (${t.employee_name})` : 'Unassign';
    sel.appendChild(emptyOpt);

    employees.forEach(emp=>{
      const o = document.createElement('option');
      o.value = emp.id;
      o.textContent = emp.name;
      if (String(emp.id) === String(t.employee_id)) o.selected = true;
      sel.appendChild(o);
    });

    // Assign button
    const assignBtn = document.createElement('button');
    assignBtn.textContent = 'Assign';
    assignBtn.className = 'small';
    assignBtn.onclick = async () => {
      const newEmpId = sel.value || null;
      try {
        await assignTask(t.id, newEmpId);
        await loadTasks();
        await loadEmployees(); // refresh employee lists too
      } catch (err) {
        alert('Failed to assign: ' + err.message);
      }
    };

        // assignTask: call backend PUT to update employee_id for a task
    async function assignTask(taskId, employeeId) {
    // employeeId is null or an id string/number
    const payload = { employee_id: employeeId, title: undefined }; // keep other fields unchanged
    // To avoid accidentally clearing title/desc, we fetch the task first then update only necessary fields
    const tasks = await request(`${API}/tasks`);
    const t = tasks.find(tt => String(tt.id) === String(taskId));
    if (!t) throw new Error('Task not found');

    const body = {
        title: t.title,
        description: t.description,
        employee_id: employeeId ? Number(employeeId) : null,
        status: t.status || 'pending'
    };

    await request(`${API}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    }


        // Delete button (existing)
        const del = document.createElement('button');
        del.textContent = 'Delete';
        del.className = 'small';
        del.onclick = async ()=>{ await request(`${API}/tasks/${t.id}`, {method:'DELETE'}); await loadTasks(); };

        right.appendChild(sel);
        right.appendChild(assignBtn);
        right.appendChild(del);

        li.appendChild(left);
        li.appendChild(right);
        ul.appendChild(li);
    });
    }



/* Forms */
document.getElementById('empForm').onsubmit = async (e)=>{
  e.preventDefault();
  const name = document.getElementById('empName').value.trim();
  const email = document.getElementById('empEmail').value.trim();
  if(!name) return alert('Name required');
  await request(`${API}/employees`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({name,email})});
  e.target.reset(); await loadEmployees();
};

document.getElementById('taskForm').onsubmit = async (e)=>{
  e.preventDefault();
  const title = document.getElementById('taskTitle').value.trim();
  const description = document.getElementById('taskDesc').value.trim();
  const employee_id = document.getElementById('taskEmp').value || null;
  if(!title) return alert('Title required');
  await request(`${API}/tasks`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({title,description,employee_id})});
  e.target.reset(); await loadTasks();
};

window.addEventListener('load', ()=>{ loadEmployees(); loadTasks(); });

/* Simple escaping */
function escapeHtml(s){
  if(!s) return '';
  return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
}
