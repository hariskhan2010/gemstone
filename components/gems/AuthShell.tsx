import StoneViewer from '@/components/gems/StoneViewer';

/** Split layout for the account pages: a turning emerald on one side, the form card on the other. */
export default function AuthShell({ title, tag, children }: { title: string; tag: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="ag-auth ag-view">
      <StoneViewer id="emerald" name="an emerald" wash="40,210,130" hint={null} fit={0.82} fitPhone={0.66} offsetY={0.09}>
        <span className="ag-mono ag-auth-top">Asian Gemstone · Members</span>
        <p className="ag-d ag-auth-tag" aria-hidden="true">{tag}</p>
      </StoneViewer>
      <div className="ag-form-card">
        <h1 className="ag-d">{title}</h1>
        {children}
      </div>
    </div>
  );
}
