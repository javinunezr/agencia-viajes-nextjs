export default function SkeletonSolicitud() {
  return (
    <div className="solicitud-card skeleton">
      <div className="solicitud-header-card">
        <div className="skeleton-text skeleton-id"></div>
        <div className="skeleton-badge"></div>
      </div>
      <div className="solicitud-body">
        <div className="solicitud-info">
          <div className="skeleton-text skeleton-label"></div>
          <div className="skeleton-text skeleton-value"></div>
        </div>
        <div className="solicitud-info">
          <div className="skeleton-text skeleton-label"></div>
          <div className="skeleton-text skeleton-value"></div>
        </div>
        <div className="solicitud-info">
          <div className="skeleton-text skeleton-label"></div>
          <div className="skeleton-text skeleton-value"></div>
        </div>
        <div className="solicitud-info">
          <div className="skeleton-text skeleton-label"></div>
          <div className="skeleton-text skeleton-value"></div>
        </div>
      </div>
    </div>
  );
}
