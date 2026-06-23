import ProjectEditor from './ProjectEditor';

export default function AdminProjectEditorPage({ params }: { params: { id: string } }) {
 const id = parseInt(params.id, 10);
 if (Number.isNaN(id)) {
 return (
 <div className="text-center py-20 text-text-muted">
 ID không hợp lệ.
 </div>
 );
 }
 return <ProjectEditor projectId={id} />;
}