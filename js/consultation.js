const form = document.querySelector('[data-consultation-form]');
const steps = [...document.querySelectorAll('[data-flow-step]')];
const stepLabel = document.querySelector('[data-step-label]');
const progress = document.querySelector('[data-step-progress]');
const categorySelect = document.getElementById('support-category');
const branchFields = document.querySelector('[data-branch-fields]');
const matchingSummary = document.querySelector('[data-matching-summary]');
const pricingSummary = document.querySelector('[data-pricing-summary]');
const contactLink = document.querySelector('[data-contact-link]');
let renderedCategory = '';

const categories = {
  'sex-therapy': {
    name: 'Sex Therapy',
    match: 'Kemi Fawole, certified sex therapist',
    fields: [
      { label: 'Is this concern ongoing or recent?', type: 'select', options: ['Ongoing', 'Recent'] },
      { label: 'Does this involve a partner, or is this individual support?', type: 'select', options: ['Individual support', 'Involves a partner'] },
      { label: 'Any relevant medical history you would like noted?', type: 'textarea', optional: true }
    ]
  },
  'family-relationship': {
    name: 'Family and Relationship',
    match: 'a vetted partner relationship therapist',
    fields: [
      { label: 'Who is involved (partner, family member, or someone else)?', type: 'text' },
      { label: 'Is this an ongoing pattern or a recent event?', type: 'select', options: ['Ongoing pattern', 'Recent event'] },
      { label: 'Would you prefer individual or joint sessions?', type: 'select', options: ['Individual sessions', 'Joint sessions', 'Not sure yet'] }
    ]
  },
  'emotional-healing': {
    name: 'Emotional Healing',
    match: 'Kemi Fawole, certified emotional therapist',
    fields: [
      { label: "What's been the biggest source of stress lately?", type: 'textarea' },
      { label: 'How long has this been affecting you?', type: 'select', options: ['Less than a month', '1–6 months', 'More than 6 months', 'Not sure'] },
      { label: 'Have you tried any coping strategies so far?', type: 'textarea', optional: true }
    ]
  },
  psychology: {
    name: 'Psychology',
    match: 'a vetted partner clinical psychologist',
    fields: [
      { label: 'Have you previously been diagnosed with or treated for any condition?', type: 'select', options: ['Yes', 'No', 'Prefer not to say'] },
      { label: 'Is this your first time seeking clinical support?', type: 'select', options: ['Yes', 'No'] }
    ]
  },
  'trauma-grief-abuse': {
    name: 'Trauma, Grief and Abuse',
    match: 'a vetted therapist experienced in this area',
    fields: [
      { label: 'Is this a recent or past experience?', type: 'select', options: ['Recent', 'Past'] },
      { label: 'Do you feel safe in your current environment?', type: 'select', options: ['Yes', 'No', 'Not sure'] },
      { label: 'Would you prefer to share details now, or discuss them directly with your therapist?', type: 'select', options: ['Share a little now', 'Discuss directly with my therapist'], optional: true, hint: 'Optional — you can skip this question.' }
    ]
  }
};

const orderedSteps = ['safety', 'category', 'core', 'branch', 'matching', 'pricing', 'complete'];
const visibleStepNumber = new Map(orderedSteps.slice(0, 6).map((step, index) => [step, index + 1]));

function showStep(name) {
  steps.forEach(step => {
    step.hidden = step.dataset.flowStep !== name;
  });

  if (stepLabel && visibleStepNumber.has(name)) {
    stepLabel.textContent = `STEP ${String(visibleStepNumber.get(name)).padStart(2, '0')} / 06`;
    progress.style.width = `${(visibleStepNumber.get(name) / 6) * 100}%`;
  } else if (stepLabel) {
    stepLabel.textContent = 'COMPLETE';
    progress.style.width = '100%';
  }
}

function getSelectedCategory() {
  return categories[categorySelect.value];
}

function addBranchField(field, index) {
  const id = `branch-question-${index}`;
  const wrapper = document.createElement('div');
  wrapper.className = 'branch-field';

  const label = document.createElement('label');
  label.className = 'field-label';
  label.htmlFor = id;
  label.textContent = field.label;
  if (field.optional) {
    const optional = document.createElement('span');
    optional.textContent = ' (optional)';
    label.append(optional);
  }
  wrapper.append(label);

  let input;
  if (field.type === 'select') {
    input = document.createElement('select');
    input.className = 'form-field';
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Choose one';
    input.append(placeholder);
    field.options.forEach(optionText => {
      const option = document.createElement('option');
      option.textContent = optionText;
      input.append(option);
    });
  } else if (field.type === 'textarea') {
    input = document.createElement('textarea');
    input.className = 'form-field';
    input.rows = 3;
  } else {
    input = document.createElement('input');
    input.className = 'form-field';
    input.type = 'text';
  }

  input.id = id;
  input.name = `branch-${index}`;
  input.required = !field.optional;
  wrapper.append(input);

  if (field.hint) {
    const hint = document.createElement('small');
    hint.className = 'field-hint';
    hint.textContent = field.hint;
    wrapper.append(hint);
  }

  branchFields.append(wrapper);
}

function renderBranch() {
  if (renderedCategory === categorySelect.value) return;
  const category = getSelectedCategory();
  branchFields.replaceChildren();
  document.querySelector('[data-branch-title]').textContent = `${category.name}: a few more questions`;
  category.fields.forEach(addBranchField);
  renderedCategory = categorySelect.value;
}

function currentStepIsValid() {
  const step = steps.find(item => !item.hidden);
  const fields = [...step.querySelectorAll('input, select, textarea')];
  const invalid = fields.find(field => !field.checkValidity());
  if (invalid) {
    invalid.reportValidity();
    invalid.focus();
    return false;
  }
  return true;
}

form.addEventListener('click', event => {
  const safetyButton = event.target.closest('[data-safety]');
  if (safetyButton) {
    if (safetyButton.dataset.safety === 'yes') {
      document.querySelector('[data-safety-stop]').hidden = false;
      document.querySelector('.safety-actions').hidden = true;
    } else {
      showStep('category');
    }
    return;
  }

  const nextButton = event.target.closest('[data-next]');
  if (nextButton) {
    if (!currentStepIsValid()) return;
    const nextStep = nextButton.dataset.next;
    if (nextStep === 'branch') renderBranch();
    if (nextStep === 'matching') {
      const category = getSelectedCategory();
      matchingSummary.textContent = `For ${category.name}, the intended therapist pathway is ${category.match}.`;
      pricingSummary.textContent = `Pricing for ${category.name} will be shared after the therapist is identified. No appointment or therapist match is confirmed until the team follows up with you.`;
    }
    showStep(nextStep);
    return;
  }

  const backButton = event.target.closest('[data-back]');
  if (backButton) {
    showStep(backButton.dataset.back);
    return;
  }

  if (event.target.closest('[data-finish]')) {
    const category = getSelectedCategory();
    const message = `Hello Viewdenlife, I would like to request a follow-up about ${category.name} consultation/therapy. Please contact me with next steps.`;
    contactLink.href = `https://wa.me/2348034666358?text=${encodeURIComponent(message)}`;
    showStep('complete');
    return;
  }

  if (event.target.closest('[data-reset]')) {
    form.reset();
    branchFields.replaceChildren();
    renderedCategory = '';
    document.querySelector('[data-safety-stop]').hidden = true;
    document.querySelector('.safety-actions').hidden = false;
    showStep('safety');
  }
});

if (document.querySelector('[data-year]')) {
  document.querySelector('[data-year]').textContent = new Date().getFullYear();
}

showStep('safety');
