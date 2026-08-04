import { useState } from 'react'
import { useLocations } from '../hooks/useLocations'
import { useTodoTemplates } from '../hooks/useTodoTemplates'
import { categoryColorStyle } from '../lib/categoryColor'
import { CATEGORY_PRESETS } from '../types'
import type { Location, Theme, TodoTemplate } from '../types'

interface SettingsSectionProps {
  theme: Theme
  onThemeChange: (theme: Theme) => void
}

const themeOptions: { value: Theme; label: string }[] = [
  { value: 'system', label: '端末設定' },
  { value: 'light', label: 'ライト' },
  { value: 'dark', label: 'ダーク' },
]

export function SettingsSection({ theme, onThemeChange }: SettingsSectionProps) {
  const { locations, addLocation, updateLocation, removeLocation } = useLocations()
  const { templates, addTemplate, updateTemplate, deleteTemplate } = useTodoTemplates()
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null)
  const [templateTitle, setTemplateTitle] = useState('')
  const [templateCategory, setTemplateCategory] = useState('')
  const [showLocationForm, setShowLocationForm] = useState(false)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!name.trim() || !url.trim()) return
    addLocation(name.trim(), url.trim())
    setName('')
    setUrl('')
    setShowLocationForm(false)
  }

  const handleTemplateSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!templateTitle.trim()) return
    addTemplate(templateTitle, templateCategory)
    setTemplateTitle('')
    setTemplateCategory('')
  }

  return (
    <>
      <p className="app__subtitle">表示テーマや天気の表示地名を登録・編集できます</p>

      <div className="dashboard-card">
        <h2 className="dashboard-card__title">表示テーマ</h2>
        <div className="segmented">
          {themeOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`segmented__btn ${theme === opt.value ? 'segmented__btn--active' : ''}`}
              onClick={() => onThemeChange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="dashboard-card">
        <h2 className="dashboard-card__title">Todoリスト登録</h2>
        <p className="app__subtitle">
          よく使う項目を登録すると、Todo追加時にプルダウンから選べます
        </p>
        <form className="todo-form" onSubmit={handleTemplateSubmit}>
          <div className="todo-form__field">
            <span>カテゴリ</span>
            <div className="todo-form__category-chips">
              {CATEGORY_PRESETS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`chip chip--category ${templateCategory === c ? 'chip--active' : ''}`}
                  style={categoryColorStyle(c)}
                  onClick={() => setTemplateCategory((prev) => (prev === c ? '' : c))}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="todo-form__row">
            <input
              className="todo-form__title"
              type="text"
              placeholder="例: ゴミ出し"
              value={templateTitle}
              onChange={(e) => setTemplateTitle(e.target.value)}
              required
            />
            <button type="submit" className="btn btn--primary">
              追加
            </button>
          </div>
        </form>
        {templates.length === 0 ? (
          <p className="todo-list__empty">まだ登録されていません</p>
        ) : (
          <ul className="settings-location-list">
            {templates.map((t) =>
              editingTemplateId === t.id ? (
                <TemplateEditRow
                  key={t.id}
                  template={t}
                  onSave={(title, category) => {
                    updateTemplate(t.id, title, category)
                    setEditingTemplateId(null)
                  }}
                  onCancel={() => setEditingTemplateId(null)}
                />
              ) : (
                <li key={t.id} className="settings-location-row settings-location-row--thin">
                  <div className="settings-location-row__info">
                    {t.category && (
                      <span className="badge badge--category" style={categoryColorStyle(t.category)}>
                        {t.category}
                      </span>
                    )}
                    <p className="settings-location-row__name">{t.title}</p>
                  </div>
                  <div className="settings-location-row__actions">
                    <button
                      type="button"
                      className="todo-item__edit"
                      onClick={() => setEditingTemplateId(t.id)}
                    >
                      編集
                    </button>
                    <button
                      type="button"
                      className="todo-item__delete"
                      aria-label="削除"
                      onClick={() => deleteTemplate(t.id)}
                    >
                      ×
                    </button>
                  </div>
                </li>
              ),
            )}
          </ul>
        )}
      </div>

      <div className="dashboard-card">
        <div className="dashboard-card__title-row">
          <h2 className="dashboard-card__title">天気エリア登録</h2>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => setShowLocationForm((v) => !v)}
          >
            {showLocationForm ? '閉じる' : '追加'}
          </button>
        </div>

        {showLocationForm && (
          <form className="todo-form" onSubmit={handleSubmit}>
            <div className="todo-form__row todo-form__row--details">
              <label className="todo-form__field">
                <span>表示名</span>
                <input
                  type="text"
                  placeholder="例: 横浜市都筑区荏田東"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>
              <label className="todo-form__field">
                <span>リンクURL</span>
                <input
                  type="url"
                  placeholder="https://weathernews.jp/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
              </label>
              <button type="submit" className="btn btn--primary">
                追加
              </button>
            </div>
          </form>
        )}

        {locations.length === 0 && <p className="todo-list__empty">地点はまだ登録されていません</p>}
        <ul className="settings-location-list">
          {locations.map((loc) =>
            editingId === loc.id ? (
              <EditRow
                key={loc.id}
                location={loc}
                onSave={(name, url) => {
                  updateLocation(loc.id, name, url)
                  setEditingId(null)
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <li key={loc.id} className="settings-location-row">
                <div className="settings-location-row__info">
                  <p className="settings-location-row__name">{loc.name}</p>
                  <a href={loc.url} target="_blank" rel="noopener noreferrer" className="settings-location-row__url">
                    {loc.url}
                  </a>
                </div>
                <div className="settings-location-row__actions">
                  <button type="button" className="btn btn--ghost" onClick={() => setEditingId(loc.id)}>
                    編集
                  </button>
                  <button
                    type="button"
                    className="todo-item__delete"
                    aria-label="削除"
                    onClick={() => removeLocation(loc.id)}
                  >
                    ×
                  </button>
                </div>
              </li>
            ),
          )}
        </ul>
      </div>
    </>
  )
}

interface EditRowProps {
  location: Location
  onSave: (name: string, url: string) => void
  onCancel: () => void
}

function EditRow({ location, onSave, onCancel }: EditRowProps) {
  const [name, setName] = useState(location.name)
  const [url, setUrl] = useState(location.url)

  return (
    <li className="settings-location-row settings-location-row--editing">
      <div className="todo-form__row todo-form__row--details">
        <label className="todo-form__field">
          <span>表示名</span>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="todo-form__field">
          <span>リンクURL</span>
          <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} />
        </label>
      </div>
      <div className="settings-location-row__actions">
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => name.trim() && url.trim() && onSave(name.trim(), url.trim())}
        >
          保存
        </button>
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          キャンセル
        </button>
      </div>
    </li>
  )
}

interface TemplateEditRowProps {
  template: TodoTemplate
  onSave: (title: string, category: string) => void
  onCancel: () => void
}

function TemplateEditRow({ template, onSave, onCancel }: TemplateEditRowProps) {
  const [title, setTitle] = useState(template.title)
  const [category, setCategory] = useState(template.category)

  return (
    <li className="settings-location-row settings-location-row--editing settings-location-row--thin">
      <div className="template-edit-row__fields">
        <div className="todo-form__field">
          <span>カテゴリ</span>
          <div className="todo-form__category-chips">
            {CATEGORY_PRESETS.map((c) => (
              <button
                key={c}
                type="button"
                className={`chip chip--category ${category === c ? 'chip--active' : ''}`}
                style={categoryColorStyle(c)}
                onClick={() => setCategory((prev) => (prev === c ? '' : c))}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <label className="todo-form__field">
          <span>項目名</span>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
      </div>
      <div className="settings-location-row__actions">
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => title.trim() && onSave(title.trim(), category)}
        >
          保存
        </button>
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          キャンセル
        </button>
      </div>
    </li>
  )
}
