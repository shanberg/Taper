import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import FormHeader from './FormHeader.svelte';
import { appStore } from '../stores';
import { get } from 'svelte/store';
import { TaperDate } from '../TaperDate'
import { DEFAULT_LANGUAGE_KEY, DEFAULT_TEMPLATE_KEY, LANGUAGES, TEMPLATES } from '../consts';


describe('FormHeader component', () => {
  it('renders the component with default values', () => {
    render(FormHeader);
    expect(screen.getByLabelText('Course begins')).toHaveValue(get(appStore).startDateInputValue);
    expect(screen.getByLabelText('Template')).toHaveValue(DEFAULT_TEMPLATE_KEY);
    expect(screen.getByLabelText('Language')).toHaveValue(DEFAULT_LANGUAGE_KEY);
  });

  it('changes the start date input value', async () => {
    render(FormHeader);
    const dateInput = screen.getByLabelText('Course begins');
    await fireEvent.change(dateInput, { target: { value: new TaperDate('2023-06-01').toYYYYMMDD() } });
    expect(get(appStore).startDateInputValue).toBe('2023-06-01');
  });

  it('changes the selected template', async () => {
    const template2Key = Object.keys(TEMPLATES)[1]

    render(FormHeader);
    const templateSelect = screen.getByLabelText('Template');
    await fireEvent.change(templateSelect, { target: { value: template2Key } });
    expect(get(appStore).schedule.templateKey).toBe(template2Key);
  });

  it('changes the selected language', async () => {
    const language2key = LANGUAGES[1].lang

    render(FormHeader);
    const languageSelect = screen.getByLabelText('Language');
    await fireEvent.change(languageSelect, { target: { value: language2key } });
    expect(get(appStore).schedule.languageKey).toBe(language2key);
  });

  it('displays unverified badge for unverified languages', () => {
    const unverifiedLanguage = LANGUAGES.find(l => !l.verified)!

    appStore.set({ schedule: { languageKey: unverifiedLanguage.lang } });
    render(FormHeader);
    expect(screen.getByText('Unverified')).toBeInTheDocument();
  });
});