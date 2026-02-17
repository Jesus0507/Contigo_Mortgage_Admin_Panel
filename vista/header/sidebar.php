        <div id="layoutSidenav_nav">
            <nav class="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
                <div class="sb-sidenav-menu">
                    <div class="nav">
                        <a  <?php if($_GET['c']=='main'){ ?>  class="nav-link text-light" <?php } else{ ?> class="nav-link" <?php }?> href="index.php?c=main&a=main_view">
                            <div  <?php if($_GET['c']=='main'){ ?>  class="sb-nav-link-icon text-light" <?php } else { ?> class="sb-nav-link-icon" <?php } ?> ><i class="fas fa-user"></i></div>
                            Para ti
                        </a>
                
                        <a <?php if($_GET['c']=='boards'){ ?>  class="nav-link text-light" <?php } else{ ?> class="nav-link" <?php }?>  href="index.php?c=boards&a=index">
                            <div <?php if($_GET['c']=='boards'){ ?>  class="sb-nav-link-icon text-light" <?php } else { ?> class="sb-nav-link-icon" <?php } ?>><i class="fas fa-	fas fa-chalkboard-teacher"></i></div>
                            Pizarras
                        </a>
                        <a <?php if($_GET['c']=='clients'){ ?>  class="nav-link text-light" <?php } else{ ?> class="nav-link" <?php } ?>  href="index.php?c=clients&a=index">
                            <div <?php if($_GET['c']=='clients'){ ?>  class="sb-nav-link-icon text-light" <?php } else { ?> class="sb-nav-link-icon" <?php } ?>><i class="fas fa-users"></i></div>
                            Clientes
                        </a>
                        <?php if($_SESSION['user_role'] == "admin"){?>
                         <a <?php if($_GET['c']=='users'){ ?>  class="nav-link text-light" <?php } else{ ?> class="nav-link" <?php } ?> href="index.php?c=users&a=index">
                            <div <?php if($_GET['c']=='users'){ ?>  class="sb-nav-link-icon text-light" <?php } else { ?> class="sb-nav-link-icon" <?php } ?>><i class="fas fa-users-cog"></i></div>
                            Agentes
                        </a>
                        <?php } ?>
                    </div>
                </div>
                <div class="sb-sidenav-footer font-bold text-light">
                    <?php echo $_SESSION['username']    ?>
                </div>
            </nav>
        </div>